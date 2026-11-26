-- Qreasee admin dashboard. Apply once after 001-006 in the Supabase SQL editor.
-- The allowlist is keyed by email so the super admin can be seeded before first login.
-- Every admin function re-checks the caller; anon has no execute permission.

create table if not exists public.qreasee_admins (
  email text primary key check (email = lower(email) and length(email) between 3 and 254),
  role text not null default 'admin' check (role in ('admin', 'super')),
  created_at timestamptz not null default now(),
  added_by text
);

alter table public.qreasee_admins enable row level security;
revoke all on public.qreasee_admins from anon, authenticated;

insert into public.qreasee_admins (email, role, added_by)
values ('rendynoorchandra@gmail.com', 'super', 'system')
on conflict (email) do update set role = 'super';

-- Returns the caller's admin profile. Safe for any authenticated user.
create or replace function public.qreasee_admin_me()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
  v_name text;
  v_avatar text;
  v_role text;
begin
  if v_uid is null then
    return jsonb_build_object('authenticated', false);
  end if;
  select lower(u.email),
         coalesce(
           nullif(u.raw_user_meta_data->>'full_name', ''),
           nullif(u.raw_user_meta_data->>'name', ''),
           split_part(u.email, '@', 1)),
         u.raw_user_meta_data->>'avatar_url'
    into v_email, v_name, v_avatar
  from auth.users u
  where u.id = v_uid;
  select a.role into v_role
  from public.qreasee_admins a
  where a.email = v_email;
  return jsonb_build_object(
    'authenticated', true,
    'email', v_email,
    'name', v_name,
    'avatar', v_avatar,
    'role', v_role,
    'admin', v_role is not null,
    'super', v_role = 'super');
end;
$$;

-- Internal guard. Not executable by clients.
create or replace function public.qreasee_require_admin()
returns text
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_role text;
begin
  if v_uid is null then raise exception 'login_required'; end if;
  select a.role into v_role
  from public.qreasee_admins a
  join auth.users u on lower(u.email) = a.email
  where u.id = v_uid
  limit 1;
  if v_role is null then raise exception 'forbidden'; end if;
  return v_role;
end;
$$;

create or replace function public.qreasee_admin_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
set statement_timeout = '12s'
as $$
declare
  v_role text := public.qreasee_require_admin();
  v_totals jsonb;
  v_series jsonb;
  v_projects jsonb;
  v_online jsonb;
begin
  select jsonb_build_object(
    'users', (select count(*) from auth.users),
    'users_today', (select count(*) from auth.users
      where created_at >= date_trunc('day', now())),
    'users_7d', (select count(*) from auth.users
      where created_at >= now() - interval '7 days'),
    'users_30d', (select count(*) from auth.users
      where created_at >= now() - interval '30 days'),
    'admins', (select count(*) from public.qreasee_admins),
    'projects', r.projects,
    'objects', r.objects,
    'comments', r.comments,
    'sections', r.sections,
    'bytes', r.bytes,
    'projects_today', r.projects_today,
    'projects_7d', r.projects_7d,
    'projects_30d', r.projects_30d,
    'active_24h', r.active_24h,
    'active_7d', r.active_7d,
    'comments_7d', (select count(*) from public.qreasee_rooms room
      cross join lateral jsonb_array_elements(
        case when jsonb_typeof(room.document->'comments') = 'array'
             then room.document->'comments' else '[]'::jsonb end) c
      where (c->>'created_at') ~ '^[0-9]+$'
        and (c->>'created_at')::bigint >=
          (extract(epoch from now()) - 604800) * 1000),
    'online', (select count(*) from public.qreasee_peers
      where seen_at >= now() - interval '2 minutes'),
    'online_rooms', (select count(distinct room_id) from public.qreasee_peers
      where seen_at >= now() - interval '2 minutes'),
    'avg_objects', case when r.projects = 0 then 0
      else round(r.objects::numeric / r.projects, 1) end,
    'largest_bytes', r.largest_bytes,
    'empty_projects', r.empty_projects,
    'role_edit', r.role_edit,
    'role_comment', r.role_comment,
    'role_view', r.role_view
  ) into v_totals
  from (
    select
      count(*) as projects,
      coalesce(sum(case when jsonb_typeof(document->'objects') = 'array'
        then jsonb_array_length(document->'objects') else 0 end), 0) as objects,
      coalesce(sum(case when jsonb_typeof(document->'comments') = 'array'
        then jsonb_array_length(document->'comments') else 0 end), 0) as comments,
      coalesce(sum(case when jsonb_typeof(document->'sections') = 'array'
        then jsonb_array_length(document->'sections') else 0 end), 0) as sections,
      coalesce(sum(octet_length(document::text)), 0) as bytes,
      coalesce(max(octet_length(document::text)), 0) as largest_bytes,
      count(*) filter (where created_at >= date_trunc('day', now())) as projects_today,
      count(*) filter (where created_at >= now() - interval '7 days') as projects_7d,
      count(*) filter (where created_at >= now() - interval '30 days') as projects_30d,
      count(*) filter (where updated_at >= now() - interval '24 hours') as active_24h,
      count(*) filter (where updated_at >= now() - interval '7 days') as active_7d,
      count(*) filter (where case when jsonb_typeof(document->'objects') = 'array'
        then jsonb_array_length(document->'objects') else 0 end = 0) as empty_projects,
      count(*) filter (where coalesce(document->'share'->>'role', 'edit') = 'edit') as role_edit,
      count(*) filter (where coalesce(document->'share'->>'role', 'edit') = 'comment') as role_comment,
      count(*) filter (where coalesce(document->'share'->>'role', 'edit') = 'view') as role_view
    from public.qreasee_rooms
  ) r;

  select jsonb_agg(jsonb_build_object(
    'date', d.day,
    'signups', coalesce(s.n, 0),
    'projects', coalesce(c.n, 0),
    'active', coalesce(a.n, 0)
  ) order by d.day) into v_series
  from (select generate_series(
      current_date - 29, current_date, interval '1 day')::date as day) d
  left join (select (created_at at time zone 'utc')::date as day, count(*) as n
    from auth.users group by 1) s on s.day = d.day
  left join (select (created_at at time zone 'utc')::date as day, count(*) as n
    from public.qreasee_rooms group by 1) c on c.day = d.day
  left join (select (updated_at at time zone 'utc')::date as day, count(*) as n
    from public.qreasee_rooms group by 1) a on a.day = d.day;

  select coalesce(jsonb_agg(entry order by (entry->>'objects')::bigint desc,
      (entry->>'updated_at')::timestamptz desc), '[]'::jsonb) into v_projects
  from (
    select jsonb_build_object(
      'id', rooms.id,
      'title', rooms.title,
      'owner_email', lower(u.email),
      'owner_name', coalesce(
        nullif(u.raw_user_meta_data->>'full_name', ''),
        nullif(u.raw_user_meta_data->>'name', '')),
      'objects', rooms.objects,
      'comments', rooms.comments,
      'bytes', rooms.bytes,
      'role', rooms.share_role,
      'updated_at', rooms.updated_at
    ) as entry
    from (
      select r.id, r.owner, r.created_at, r.updated_at, r.document,
             case when jsonb_typeof(r.document->'objects') = 'array'
                  then jsonb_array_length(r.document->'objects') else 0 end as objects,
             case when jsonb_typeof(r.document->'comments') = 'array'
                  then jsonb_array_length(r.document->'comments') else 0 end as comments,
             octet_length(r.document::text) as bytes,
             coalesce(r.document->'share'->>'role', 'edit') as share_role,
             coalesce(
               nullif(r.document->'sheet'->>'title', ''),
               nullif(r.document->>'title', ''),
               'Proyek tanpa judul') as title
      from public.qreasee_rooms r
    ) rooms
    left join auth.users u on u.id = rooms.owner
    order by rooms.objects desc, rooms.updated_at desc
    limit 10
  ) ranked;

  select coalesce(jsonb_agg(jsonb_build_object(
    'room', peer.room_id,
    'title', coalesce(
      nullif(room.document->'sheet'->>'title', ''),
      'Proyek tanpa judul'),
    'name', peer.name,
    'seen_at', peer.seen_at
  ) order by peer.seen_at desc), '[]'::jsonb) into v_online
  from (
    select p.room_id, p.name, p.seen_at
    from public.qreasee_peers p
    where p.seen_at >= now() - interval '2 minutes'
    order by p.seen_at desc
    limit 12
  ) peer
  join public.qreasee_rooms room on room.id = peer.room_id;

  return jsonb_build_object(
    'role', v_role,
    'generated_at', now(),
    'totals', v_totals,
    'series', coalesce(v_series, '[]'::jsonb),
    'projects', v_projects,
    'online', v_online);
end;
$$;

create or replace function public.qreasee_admin_users(p_search text default null, p_limit integer default 200)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
set statement_timeout = '12s'
as $$
declare
  v_role text := public.qreasee_require_admin();
begin
  return (
    select coalesce(jsonb_agg(row_json order by last_project_at desc nulls last,
        created_at desc), '[]'::jsonb)
    from (
      select jsonb_build_object(
        'id', u.id,
        'email', lower(u.email),
        'name', coalesce(
          nullif(u.raw_user_meta_data->>'full_name', ''),
          nullif(u.raw_user_meta_data->>'name', ''),
          split_part(u.email, '@', 1)),
        'created_at', u.created_at,
        'last_sign_in_at', u.last_sign_in_at,
        'confirmed', u.email_confirmed_at is not null,
        'projects', coalesce(o.projects, 0),
        'objects', coalesce(o.objects, 0),
        'last_project_at', o.last_project_at,
        'role', a.role
      ) as row_json,
      o.last_project_at, u.created_at
      from auth.users u
      left join (
        select r.owner,
               count(*)::integer as projects,
               coalesce(sum(
                 case when jsonb_typeof(r.document->'objects') = 'array'
                      then jsonb_array_length(r.document->'objects') else 0 end), 0)::integer as objects,
               max(r.updated_at) as last_project_at
        from public.qreasee_rooms r
        where r.owner is not null
        group by r.owner
      ) o on o.owner = u.id
      left join public.qreasee_admins a on a.email = lower(u.email)
      where p_search is null or btrim(p_search) = ''
         or u.email ilike '%' || btrim(p_search) || '%'
         or coalesce(u.raw_user_meta_data->>'full_name', '') ilike '%' || btrim(p_search) || '%'
      order by o.last_project_at desc nulls last, u.created_at desc
      limit greatest(1, least(coalesce(p_limit, 200), 500))
    ) q
  );
end;
$$;

create or replace function public.qreasee_admin_projects(p_search text default null, p_limit integer default 200)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
set statement_timeout = '12s'
as $$
declare
  v_role text := public.qreasee_require_admin();
begin
  return (
    select coalesce(jsonb_agg(row_json order by updated_at desc), '[]'::jsonb)
    from (
      select jsonb_build_object(
        'id', r.id,
        'title', coalesce(
          nullif(r.document->'sheet'->>'title', ''),
          nullif(r.document->>'title', ''),
          'Proyek tanpa judul'),
        'owner_email', lower(u.email),
        'owner_name', coalesce(
          nullif(u.raw_user_meta_data->>'full_name', ''),
          nullif(u.raw_user_meta_data->>'name', '')),
        'objects', case when jsonb_typeof(r.document->'objects') = 'array'
          then jsonb_array_length(r.document->'objects') else 0 end,
        'comments', case when jsonb_typeof(r.document->'comments') = 'array'
          then jsonb_array_length(r.document->'comments') else 0 end,
        'sections', case when jsonb_typeof(r.document->'sections') = 'array'
          then jsonb_array_length(r.document->'sections') else 0 end,
        'bytes', octet_length(r.document::text),
        'role', coalesce(r.document->'share'->>'role', 'edit'),
        'created_at', r.created_at,
        'updated_at', r.updated_at
      ) as row_json,
      r.updated_at
      from public.qreasee_rooms r
      left join auth.users u on u.id = r.owner
      where p_search is null or btrim(p_search) = ''
         or r.id::text = btrim(p_search)
         or coalesce(r.document->'sheet'->>'title', '') ilike '%' || btrim(p_search) || '%'
         or coalesce(u.email, '') ilike '%' || btrim(p_search) || '%'
      order by r.updated_at desc
      limit greatest(1, least(coalesce(p_limit, 200), 500))
    ) q
  );
end;
$$;

create or replace function public.qreasee_admin_comments(p_limit integer default 100)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
set statement_timeout = '12s'
as $$
declare
  v_role text := public.qreasee_require_admin();
begin
  return (
    select coalesce(jsonb_agg(row_json order by created_ms desc), '[]'::jsonb)
    from (
      select jsonb_build_object(
        'room', r.id,
        'title', coalesce(
          nullif(r.document->'sheet'->>'title', ''),
          nullif(r.document->>'title', ''),
          'Proyek tanpa judul'),
        'author', c->>'author',
        'text', c->>'text',
        'created_at', (c->>'created_at')::bigint,
        'resolved', coalesce((c->>'resolved')::boolean, false),
        'reply', c ? 'parent'
      ) as row_json,
      (c->>'created_at')::bigint as created_ms
      from public.qreasee_rooms r
      cross join lateral jsonb_array_elements(
        case when jsonb_typeof(r.document->'comments') = 'array'
             then r.document->'comments' else '[]'::jsonb end) c
      where (c->>'created_at') ~ '^[0-9]+$'
      order by created_ms desc
      limit greatest(1, least(coalesce(p_limit, 100), 300))
    ) q
  );
end;
$$;

create or replace function public.qreasee_admin_list()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_role text := public.qreasee_require_admin();
begin
  return (
    select coalesce(jsonb_agg(jsonb_build_object(
      'email', a.email,
      'role', a.role,
      'created_at', a.created_at,
      'added_by', a.added_by,
      'user_id', u.id,
      'name', coalesce(
        nullif(u.raw_user_meta_data->>'full_name', ''),
        split_part(a.email, '@', 1)),
      'last_sign_in_at', u.last_sign_in_at
    ) order by (a.role = 'super') desc, a.created_at), '[]'::jsonb)
    from public.qreasee_admins a
    left join auth.users u on lower(u.email) = a.email
  );
end;
$$;

create or replace function public.qreasee_admin_add(p_email text, p_role text default 'admin')
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_role text := public.qreasee_require_admin();
  v_email text := lower(btrim(p_email));
  v_actor text;
begin
  if v_role <> 'super' then raise exception 'forbidden'; end if;
  if v_email is null or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' or length(v_email) > 254 then
    raise exception 'invalid_email';
  end if;
  if p_role is null or p_role not in ('admin', 'super') then raise exception 'invalid_role'; end if;
  select lower(u.email) into v_actor from auth.users u where u.id = auth.uid();
  insert into public.qreasee_admins (email, role, added_by)
  values (v_email, p_role, v_actor)
  on conflict (email) do update set role = excluded.role, added_by = excluded.added_by;
  return jsonb_build_object('ok', true, 'email', v_email, 'role', p_role);
end;
$$;

create or replace function public.qreasee_admin_remove(p_email text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_role text := public.qreasee_require_admin();
  v_email text := lower(btrim(p_email));
  v_target text;
  v_supers bigint;
begin
  if v_role <> 'super' then raise exception 'forbidden'; end if;
  select role into v_target from public.qreasee_admins where email = v_email;
  if v_target is null then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  select count(*) into v_supers from public.qreasee_admins where role = 'super';
  if v_target = 'super' and v_supers <= 1 then raise exception 'last_super'; end if;
  delete from public.qreasee_admins where email = v_email;
  return jsonb_build_object('ok', true);
end;
$$;

revoke all on function public.qreasee_admin_me() from public;
revoke all on function public.qreasee_require_admin() from public;
revoke all on function public.qreasee_admin_overview() from public;
revoke all on function public.qreasee_admin_users(text, integer) from public;
revoke all on function public.qreasee_admin_projects(text, integer) from public;
revoke all on function public.qreasee_admin_comments(integer) from public;
revoke all on function public.qreasee_admin_list() from public;
revoke all on function public.qreasee_admin_add(text, text) from public;
revoke all on function public.qreasee_admin_remove(text) from public;

revoke execute on function public.qreasee_admin_me() from anon;
revoke execute on function public.qreasee_require_admin() from anon, authenticated;
revoke execute on function public.qreasee_admin_overview() from anon;
revoke execute on function public.qreasee_admin_users(text, integer) from anon;
revoke execute on function public.qreasee_admin_projects(text, integer) from anon;
revoke execute on function public.qreasee_admin_comments(integer) from anon;
revoke execute on function public.qreasee_admin_list() from anon;
revoke execute on function public.qreasee_admin_add(text, text) from anon;
revoke execute on function public.qreasee_admin_remove(text) from anon;

grant execute on function public.qreasee_admin_me() to authenticated;
grant execute on function public.qreasee_admin_overview() to authenticated;
grant execute on function public.qreasee_admin_users(text, integer) to authenticated;
grant execute on function public.qreasee_admin_projects(text, integer) to authenticated;
grant execute on function public.qreasee_admin_comments(integer) to authenticated;
grant execute on function public.qreasee_admin_list() to authenticated;
grant execute on function public.qreasee_admin_add(text, text) to authenticated;
grant execute on function public.qreasee_admin_remove(text) to authenticated;
