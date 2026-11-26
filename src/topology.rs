use crate::model::{FaceChanges, Object, Profile, Shape};
use std::collections::{BTreeMap, BTreeSet};
use uuid::Uuid;

type XY = [f64; 2];
type Vertex = [i64; 2];
const PRECISION: f64 = 100_000.0;
const EPS: f64 = 0.000_01;

#[derive(Clone, PartialEq, Eq, PartialOrd, Ord)]
struct Loop {
    scope: Option<String>,
    z: i64,
    vertices: Vec<Vertex>,
}

fn integer(value: f64) -> i64 {
    (value * PRECISION).round() as i64
}

fn meters(value: i64) -> f64 {
    value as f64 / PRECISION
}

fn vertex(point: XY) -> Vertex {
    point.map(integer)
}

fn subtract(a: XY, b: XY) -> XY {
    [a[0] - b[0], a[1] - b[1]]
}

fn cross(a: XY, b: XY) -> f64 {
    a[0] * b[1] - a[1] * b[0]
}

fn corner(a: XY, b: XY, c: XY) -> f64 {
    cross(subtract(b, a), subtract(c, a))
}

pub fn triangulate(points: &[XY]) -> Vec<[usize; 3]> {
    let mut remaining: Vec<_> = (0..points.len()).collect();
    let mut triangles = Vec::new();
    while remaining.len() >= 3 {
        let count = remaining.len();
        let ear = (0..count).find_map(|index| {
            let a = remaining[(index + count - 1) % count];
            let b = remaining[index];
            let c = remaining[(index + 1) % count];
            let [p, q, r] = [points[a], points[b], points[c]];
            if corner(p, q, r) <= 1e-12 {
                return None;
            }
            let contains_point = remaining.iter().copied().any(|other| {
                let test = points[other];
                other != a
                    && other != b
                    && other != c
                    && corner(p, q, test) >= -1e-12
                    && corner(q, r, test) >= -1e-12
                    && corner(r, p, test) >= -1e-12
            });
            (!contains_point).then_some((index, [a, b, c]))
        });
        let Some((index, triangle)) = ear else {
            return Vec::new();
        };
        triangles.push(triangle);
        remaining.remove(index);
    }
    triangles
}

fn scope(object: &Object) -> Option<String> {
    object
        .container
        .as_ref()
        .map(|container| container.id.clone())
}

fn segments(objects: &[Object]) -> BTreeMap<(Option<String>, i64), Vec<[Vertex; 2]>> {
    let mut planes = BTreeMap::<_, Vec<_>>::new();
    for object in objects
        .iter()
        .filter(|object| object.shape == Shape::Line && object.height == 0.0 && object.solid_id.is_none())
    {
        let points = object.footprint();
        let mut pair = [vertex(points[0]), vertex(points[1])];
        pair.sort_unstable();
        if pair[0] != pair[1] {
            planes
                .entry((scope(object), integer(object.z)))
                .or_default()
                .push(pair);
        }
    }
    for lines in planes.values_mut() {
        lines.sort_unstable();
        lines.dedup();
    }
    planes
}

fn loops(objects: &[Object]) -> BTreeSet<Loop> {
    loops_in_planes(segments(objects))
}

fn loops_in_planes(planes: BTreeMap<(Option<String>, i64), Vec<[Vertex; 2]>>) -> BTreeSet<Loop> {
    let mut result = BTreeSet::new();
    for ((scope, z), lines) in planes {
        for vertices in bounded_faces(&lines) {
            result.insert(Loop {
                scope: scope.clone(),
                z,
                vertices,
            });
        }
    }
    result
}

fn point_along(a: XY, b: XY, t: f64) -> XY {
    [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
}

fn nodes([a, b]: [Vertex; 2], [c, d]: [Vertex; 2]) -> Vec<Vertex> {
    let [a, b, c, d] = [a, b, c, d].map(|point| point.map(meters));
    let ab = subtract(b, a);
    let cd = subtract(d, c);
    let offset = subtract(c, a);
    let det = cross(ab, cd);
    let ab_len = ab[0].hypot(ab[1]);
    let cd_len = cd[0].hypot(cd[1]);
    let a_tol = EPS / ab_len;
    let c_tol = EPS / cd_len;
    if det.abs() > 1e-10 * ab_len * cd_len {
        let t = cross(offset, cd) / det;
        let u = cross(offset, ab) / det;
        if (-a_tol..=1.0 + a_tol).contains(&t) && (-c_tol..=1.0 + c_tol).contains(&u) {
            let point = if t.abs() <= a_tol {
                a
            } else if (t - 1.0).abs() <= a_tol {
                b
            } else if u.abs() <= c_tol {
                c
            } else if (u - 1.0).abs() <= c_tol {
                d
            } else {
                point_along(a, b, t)
            };
            return vec![vertex(point)];
        }
        return Vec::new();
    }
    if cross(ab, offset).abs() > EPS * ab_len {
        return Vec::new();
    }
    let in_range = |point: XY, start: XY, end: XY| {
        (0..2)
            .all(|i| (start[i].min(end[i]) - EPS..=start[i].max(end[i]) + EPS).contains(&point[i]))
    };
    [a, b, c, d]
        .into_iter()
        .filter(|point| in_range(*point, a, b) && in_range(*point, c, d))
        .map(vertex)
        .collect()
}

fn twice_area(points: &[Vertex]) -> i128 {
    (0..points.len())
        .map(|i| {
            let [ax, ay] = points[i].map(i128::from);
            let [bx, by] = points[(i + 1) % points.len()].map(i128::from);
            ax * by - ay * bx
        })
        .sum()
}

fn canonical(mut points: Vec<Vertex>) -> Vec<Vertex> {
    let mut index = 0;
    while points.len() > 3 && index < points.len() {
        let length = points.len();
        let [a, b, c] = [
            points[(index + length - 1) % length],
            points[index],
            points[(index + 1) % length],
        ];
        let normal = cross(
            subtract(b.map(meters), a.map(meters)),
            subtract(c.map(meters), a.map(meters)),
        );
        let span = ((c[0] - a[0]) as f64).hypot((c[1] - a[1]) as f64) / PRECISION;
        if normal.abs() <= EPS * span {
            points.remove(index);
        } else {
            index += 1;
        }
    }
    if let Some((start, _)) = points.iter().enumerate().min_by_key(|(_, point)| *point) {
        points.rotate_left(start);
    }
    points
}

fn bounded_faces(lines: &[[Vertex; 2]]) -> Vec<Vec<Vertex>> {
    if lines.len() < 3 {
        return Vec::new();
    }
    let mut splits: Vec<_> = lines.iter().map(|line| line.to_vec()).collect();
    for (i, &line) in lines.iter().enumerate() {
        for (j, &other) in lines.iter().enumerate().skip(i + 1) {
            let cuts = nodes(line, other);
            splits[i].extend(cuts.iter().copied());
            splits[j].extend(cuts);
        }
    }
    let mut graph = BTreeMap::<Vertex, Vec<Vertex>>::new();
    for (line, mut cuts) in lines.iter().zip(splits) {
        let [a, b] = *line;
        let axis = usize::from((b[1] - a[1]).abs() > (b[0] - a[0]).abs());
        cuts.sort_unstable_by_key(|point| (point[axis], point[1 - axis]));
        cuts.dedup();
        for pair in cuts.windows(2) {
            graph.entry(pair[0]).or_default().push(pair[1]);
            graph.entry(pair[1]).or_default().push(pair[0]);
        }
    }
    for (&point, neighbours) in &mut graph {
        neighbours.sort_unstable();
        neighbours.dedup();
        let angle =
            |target: Vertex| ((target[1] - point[1]) as f64).atan2((target[0] - point[0]) as f64);
        neighbours.sort_unstable_by(|left, right| angle(*left).total_cmp(&angle(*right)));
    }
    let mut leaves: Vec<_> = graph
        .iter()
        .filter(|(_, neighbours)| neighbours.len() == 1)
        .map(|(point, _)| *point)
        .collect();
    while let Some(leaf) = leaves.pop() {
        let Some(neighbours) = graph.remove(&leaf) else {
            continue;
        };
        if let Some(other) = neighbours.first().and_then(|point| graph.get_mut(point)) {
            other.retain(|point| *point != leaf);
            if other.len() == 1 {
                leaves.push(neighbours[0]);
            }
        }
    }
    let mut visited = BTreeSet::new();
    let mut result = Vec::new();
    for (&a, neighbours) in &graph {
        for &b in neighbours {
            let start = (a, b);
            let mut edge = start;
            let mut walk = Vec::new();
            while visited.insert(edge) {
                let (from, to) = edge;
                walk.push(from);
                let options = &graph[&to];
                let reverse = options.iter().position(|point| *point == from).unwrap();
                edge = (to, options[(reverse + options.len() - 1) % options.len()]);
            }
            // Positive winding selects bounded cells in the XY plane.
            if edge == start
                && walk.len() >= 3
                && twice_area(&walk) > 10
                && walk.iter().collect::<BTreeSet<_>>().len() == walk.len()
            {
                result.push(canonical(walk));
            }
        }
    }
    result
}

fn existing_face(object: &Object) -> Loop {
    Loop {
        scope: scope(object),
        z: integer(object.z),
        vertices: canonical(object.footprint().into_iter().map(vertex).collect()),
    }
}

fn new_face(region: &Loop) -> Option<Object> {
    let points: Vec<_> = region
        .vertices
        .iter()
        .map(|point| point.map(meters))
        .collect();
    let min = [0, 1].map(|i| {
        points
            .iter()
            .map(|point| point[i])
            .fold(f64::INFINITY, f64::min)
    });
    let max = [0, 1].map(|i| {
        points
            .iter()
            .map(|point| point[i])
            .fold(f64::NEG_INFINITY, f64::max)
    });
    let [width, depth] = subtract(max, min);
    let [x, y] = point_along(min, max, 0.5);
    let profile = points
        .iter()
        .map(|point| [(point[0] - x) / width, (point[1] - y) / depth])
        .collect();
    let object = Object {
        id: Uuid::new_v4().to_string(),
        name: "Bidang dari garis".into(),
        shape: Shape::Polygon,
        x,
        y,
        z: meters(region.z),
        width,
        depth,
        height: 0.0,
        rotation: 0.0,
        color: "#dfcbb8".into(),
        container: None,
        profile: Some(Box::new(Profile {
            points: profile,
            inferred: true,
        })),
        wall_axis: None,
        plane_u: None,
        plane_v: None,
        solid_id: None,
        surface_role: None,
        opening_id: None,
        opening_origin: None,
        hide_edges: false,
    };
    object.valid().then_some(object)
}

pub fn update_faces(
    before: &[Object],
    next: &mut Vec<Object>,
    explicit: &BTreeMap<&String, &Object>,
) -> FaceChanges {
    let old_planes = segments(before);
    let new_planes = segments(next);
    if old_planes == new_planes {
        return FaceChanges::default();
    }
    let old = loops_in_planes(old_planes);
    let current = loops_in_planes(new_planes);
    let mut changes = FaceChanges::default();
    next.retain(|object| {
        if object
            .profile
            .as_ref()
            .is_some_and(|profile| profile.inferred)
            && !explicit.contains_key(&object.id)
        {
            let region = existing_face(object);
            if old.contains(&region) && !current.contains(&region) {
                changes.removed.push(object.clone());
                return false;
            }
        }
        true
    });
    changes
        .added
        .extend(add_faces(next, current.difference(&old)));
    changes
}

fn add_faces<'a>(
    objects: &mut Vec<Object>,
    regions: impl Iterator<Item = &'a Loop>,
) -> Vec<Object> {
    let existing: BTreeSet<_> = objects
        .iter()
        .filter(|object| {
            object.height == 0.0
                && object.solid_id.is_none()
                && object.wall_axis.is_none()
                && object.plane_u.is_none()
                && matches!(object.shape, Shape::Polygon | Shape::Rectangle)
        })
        .map(existing_face)
        .collect();
    let mut anchors = BTreeMap::<String, Object>::new();
    for object in objects.iter().filter(|object| object.shape == Shape::Line) {
        if let Some(id) = scope(object) {
            let anchor = anchors.entry(id).or_insert_with(|| object.clone());
            if object.container.as_ref().unwrap().slot < anchor.container.as_ref().unwrap().slot {
                *anchor = object.clone();
            }
        }
    }
    let mut linked = BTreeMap::<(String, i64, Vec<Vertex>), (Object, Object)>::new();
    let mut added = Vec::new();
    for region in regions.filter(|region| !existing.contains(region)) {
        let Some(mut object) = new_face(region) else {
            continue;
        };
        if let Some(anchor) = region.scope.as_ref().and_then(|id| anchors.get(id)) {
            let mut container = anchor.container.clone().unwrap();
            if let Some(definition) = &container.definition {
                let local = region
                    .vertices
                    .iter()
                    .map(|p| [p[0] - integer(anchor.x), p[1] - integer(anchor.y)])
                    .collect();
                let key = (definition.clone(), region.z - integer(anchor.z), local);
                if let Some((reference, origin)) = linked.get(&key) {
                    let id = object.id;
                    object = reference.clone();
                    object.id = id;
                    object.x += anchor.x - origin.x;
                    object.y += anchor.y - origin.y;
                    object.z += anchor.z - origin.z;
                    container.slot = reference.container.as_ref().unwrap().slot.clone();
                } else {
                    container.slot = Some(Uuid::new_v4().to_string());
                    object.container = Some(container.clone());
                    linked.insert(key, (object.clone(), anchor.clone()));
                }
            }
            object.container = Some(container);
        }
        added.push(object);
    }
    objects.extend(added.iter().cloned());
    added
}

pub fn initialize_faces(objects: &mut Vec<Object>) -> usize {
    let regions = loops(objects);
    add_faces(objects, regions.iter()).len()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::{apply, demo, Edit};

    fn line(a: XY, b: XY, z: f64) -> Object {
        let [x, y] = point_along(a, b, 0.5);
        let [width, depth] = subtract(b, a);
        Object {
            id: Uuid::new_v4().to_string(),
            name: "Garis".into(),
            shape: Shape::Line,
            x,
            y,
            z,
            width,
            depth,
            height: 0.0,
            rotation: 0.0,
            color: "#000000".into(),
            container: None,
            profile: None,
            wall_axis: None,
            plane_u: None,
            plane_v: None,
            solid_id: None,
            surface_role: None,
            opening_id: None,
            opening_origin: None,
            hide_edges: false,
        }
    }

    #[test]
    fn concave_loops_become_independent_faces_only_when_closed() {
        let ring = [[0., 0.], [4., 0.], [4., 2.], [2., 2.], [2., 4.], [0., 4.]];
        let mut doc = demo();
        doc.objects.clear();
        let mut lines: Vec<_> = ring
            .iter()
            .enumerate()
            .map(|(i, &point)| line(point, ring[(i + 1) % ring.len()], 2.0))
            .collect();
        let closing = lines.pop().unwrap();
        let created = apply(
            &mut doc,
            Edit::Batch {
                before: vec![],
                after: lines,
                replay: false,
            },
        )
        .unwrap();
        assert!(created.added.is_empty());
        let displaced = line(ring[5], ring[0], 2.1);
        let disjoint = apply(
            &mut doc,
            Edit::Object {
                before: None,
                after: Some(displaced),
            },
        )
        .unwrap();
        assert!(disjoint.added.is_empty());
        let result = apply(
            &mut doc,
            Edit::Object {
                before: None,
                after: Some(closing.clone()),
            },
        )
        .unwrap();
        let face = result.added[0].clone();
        assert_eq!(face.profile.as_ref().unwrap().points.len(), 6);
        assert_eq!(face.mesh().faces.len(), 4);
        assert_eq!(face.z, 2.0);
        assert_eq!(
            doc.objects
                .iter()
                .filter(|item| item.shape == Shape::Line)
                .count(),
            7
        );
        apply(
            &mut doc,
            Edit::Object {
                before: Some(face),
                after: None,
            },
        )
        .unwrap();
        let branch = line([0., 0.], [-1., 0.], 2.0);
        let result = apply(
            &mut doc,
            Edit::Object {
                before: None,
                after: Some(branch),
            },
        )
        .unwrap();
        assert!(result.added.is_empty());
    }

    #[test]
    fn crossing_through_edges_subdivides_closed_region() {
        let mut doc = demo();
        doc.objects.clear();
        let corners = [[0., 0.], [4., 0.], [4., 4.], [0., 4.]];
        let edges = corners
            .iter()
            .enumerate()
            .map(|(i, &point)| line(point, corners[(i + 1) % 4], 0.0))
            .collect();
        let original = apply(
            &mut doc,
            Edit::Batch {
                before: vec![],
                after: edges,
                replay: false,
            },
        )
        .unwrap();
        let divider = line([-1., 2.], [5., 2.], 0.0);
        let split = apply(
            &mut doc,
            Edit::Object {
                before: None,
                after: Some(divider.clone()),
            },
        )
        .unwrap();
        assert_eq!(split.removed, original.added);
        assert_eq!(split.added.len(), 2);
        let undo = apply(
            &mut doc,
            Edit::Batch {
                before: [vec![divider], split.added].concat(),
                after: split.removed,
                replay: true,
            },
        )
        .unwrap();
        assert!(undo.added.is_empty());
        assert_eq!(doc.objects.len(), 5);
    }
}
