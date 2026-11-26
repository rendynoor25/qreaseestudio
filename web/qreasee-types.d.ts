// Shared shapes for the browser client. Keep these in sync with src/model.rs,
// src/main.rs, and the JSON written by the Rust server.

type QreaseePoint = [number, number, number];
type QreaseePoint2 = [number, number];
type QreaseeView = 'perspective' | 'iso' | 'plan' | 'front' | 'right';
type QreaseeShape = 'line' | 'rectangle' | 'circle' | 'polygon' | 'mesh';
type QreaseeMaterial = 'brick' | 'hebel' | 'timber' | 'zinc' | 'clay_tile' |
  'concrete_tile' | 'glass' | 'grass' | 'sand' | 'asphalt' | 'metal' | 'paint';
type QreaseeTool =
  | 'select' | 'line' | 'arc' | 'offset' | 'rectangle' | 'circle'
  | 'pull' | 'move' | 'rotate' | 'scale' | 'erase' | 'measure'
  | 'section' | 'bucket' | 'orbit' | 'pan';

interface QreaseeMembership {
  id: string;
  name: string;
  definition: string | null;
  slot: string | null;
}

interface QreaseeProfile {
  points: QreaseePoint2[];
  inferred: boolean;
}

interface QreaseeObject {
  id: string;
  name: string;
  shape: QreaseeShape;
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  rotation: number;
  color: string;
  material?: QreaseeMaterial | null;
  hidden?: boolean;
  container?: QreaseeMembership | null;
  profile?: QreaseeProfile | null;
  geometry?: {vertices:QreaseePoint[]; faces:[number,number,number][]} | null;
  wall_axis?: QreaseePoint2 | null;
  plane_u?: QreaseePoint | null;
  plane_v?: QreaseePoint | null;
  solid_id?: string | null;
  surface_role?: 'top' | 'bottom' | 'side' | 'edge' | 'pocket' | null;
  opening_id?: string | null;
  opening_origin?: QreaseePoint | null;
  hide_edges?: boolean;
}

interface QreaseeSheet {
  title: string;
  number: string;
  scale: number;
  notes: string;
  cut_height: number;
  room_title?: string;
  drawn_by?: string;
  checked_by?: string;
  issue_date?: string;
  layout?: {
    views: Array<{id:string; mode:'plan'|'front'|'right'|'iso'; x:number; y:number; w:number; h:number; title:string; grid?:boolean}>;
    texts: Array<{id:string; x:number; y:number; text:string; size:number; viewId?:string}>;
    gridLines?: Array<{id:string; viewId:string; a:QreaseePoint2; b:QreaseePoint2; name:string}>;
    dimensions: Array<{id:string; viewId:string; a:QreaseePoint2; b:QreaseePoint2; gridA?:string; gridB?:string}>;
  };
}

interface QreaseeComment {
  id: string;
  target: string;
  author: string;
  text: string;
  created_at: number;
  mentions?: string[];
  parent?: string;
  resolved?: boolean;
}

interface QreaseeSectionPlane {
  id: string;
  name: string;
  symbol: string;
  origin: QreaseePoint;
  normal: QreaseePoint;
  enabled?: boolean;
  hidden?: boolean;
}

interface QreaseeShare {
  role: 'edit' | 'comment' | 'view';
}

interface QreaseeDocument {
  revision: number;
  objects: QreaseeObject[];
  sheet: QreaseeSheet;
  comments?: QreaseeComment[];
  sections?: QreaseeSectionPlane[];
  share?: QreaseeShare;
  faces_initialized?: boolean;
}

interface QreaseeMesh {
  vertices: QreaseePoint[];
  faces: number[][];
  cut: boolean;
  cap?: [number, number, number][] | null;
}

interface QreaseeObjectEdit {
  type: 'object';
  before?: QreaseeObject | null;
  after?: QreaseeObject | null;
}

interface QreaseeBatchEdit {
  type: 'batch';
  before: QreaseeObject[];
  after: QreaseeObject[];
  replay?: boolean;
}

interface QreaseeSheetEdit {
  type: 'sheet';
  before: QreaseeSheet;
  after: QreaseeSheet;
}

interface QreaseeCommentEdit {
  type: 'comment';
  before?: QreaseeComment | null;
  after?: QreaseeComment | null;
}

interface QreaseeShareEdit {
  type: 'share';
  before: QreaseeShare;
  after: QreaseeShare;
}

interface QreaseeSectionEdit {
  type: 'section';
  before?: QreaseeSectionPlane | null;
  after?: QreaseeSectionPlane | null;
}

type QreaseeEdit = QreaseeObjectEdit | QreaseeBatchEdit | QreaseeSheetEdit |
  QreaseeCommentEdit | QreaseeShareEdit | QreaseeSectionEdit;

interface QreaseeChangeSet {
  document: QreaseeDocument;
  meshes: QreaseeMesh[];
  plans: QreaseeMesh[];
}

interface QreaseeLinePreview {
  a: QreaseePoint;
  b: QreaseePoint;
}

interface QreaseeCursor {
  mode: 'model' | 'layout';
  x: number;
  y: number;
  z?: number;
  line?: QreaseeLinePreview;
}

interface QreaseePeer {
  id: string;
  name: string;
  cursor: QreaseeCursor | null;
}

interface QreaseeFaceChanges {
  added: QreaseeObject[];
  removed: QreaseeObject[];
}

interface QreaseeResponse {
  changes?: QreaseeChangeSet | null;
  peers?: QreaseePeer[];
  error?: string | null;
  can_manage?: boolean;
  role?: 'edit' | 'comment' | 'view';
  topology?: QreaseeFaceChanges | null;
  room?: string;
}

interface QreaseeLinePending {
  a: QreaseePoint;
  b: QreaseePoint | null;
  preview: QreaseePoint[];
  raw?: QreaseePoint | null;
}

declare const QreaseeLine: typeof import('./line-geometry');

interface QreaseeInference {
  world: QreaseePoint;
  label: string;
}

interface QreaseeHit {
  object: QreaseeObject;
  points: number[][];
  edges: boolean[] | null;
  world: QreaseePoint[];
  top: boolean;
  tone: number;
  cut: boolean;
  depth: number;
  smooth: boolean;
  quiet: boolean;
  section?: boolean;
  hidden?: boolean;
  key: string;
}

interface QreaseeCamera {
  yaw: number;
  pitch: number;
  axes: number[][] | null;
  scale: number;
  base: number;
  baseDistance: number;
  x: number;
  y: number;
  center: QreaseePoint;
  distance: number;
  perspective: boolean;
}

interface QreaseeState {
  room: string;
  client: string;
  name: string;
  doc: QreaseeDocument | null;
  meshes: QreaseeMesh[];
  plans: QreaseeMesh[];
  selected: Set<string>;
  inside: string | null;
  tool: QreaseeTool;
  layout: boolean;
  busy: boolean;
  snapping: boolean;
  inference: QreaseeInference | null;
  undo: any[];
  redo: any[];
  drag: any;
  arcPending: any;
  linePending: QreaseeLinePending | null;
  linePress: any;
  drawPending: any;
  movePending: any;
  rotatePending: any;
  offsetPending: any;
  measurePending: any;
  sectionPending: any;
  hits: QreaseeHit[];
  hoverKey: string | null;
  epoch: number;
  polling: boolean;
  peers: QreaseePeer[];
  cursor: QreaseeCursor | null;
  canManageShare: boolean;
  shareRole: 'edit' | 'comment' | 'view';
  showHidden: boolean;
}

interface QreaseeCloudConfig {
  url: string;
  key: string;
}

interface Window {
  qreaseeDemoPost?: (url: string, request: any) => Promise<{ code: number; data: QreaseeResponse }>;
  qreaseeCloudPost?: boolean;
  qreaseeCloudConfig?: QreaseeCloudConfig;
  qreaseeAuth?: {
    ready: Promise<unknown>;
    session(): Promise<{ access_token: string }>;
    readonly userId: string;
    readonly recentProjects: Array<{ id: string; title: string; updatedAt: number }>;
    rememberProject(project: { id: string; title: string; updatedAt: number }): Promise<void>;
    readonly displayName: string;
    signOut(): Promise<void>;
  };
}
