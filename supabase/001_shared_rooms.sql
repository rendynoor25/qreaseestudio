-- Qreasee shared-link demo. Apply once in the Supabase SQL editor.
-- A room UUID is an edit capability. Do not use this schema for private projects.

create table if not exists public.qreasee_rooms (
  id uuid primary key default gen_random_uuid(),
  document jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.qreasee_peers (
  room_id uuid not null references public.qreasee_rooms(id) on delete cascade,
  client_id uuid not null,
  name text not null,
  cursor jsonb,
  seen_at timestamptz not null default now(),
  primary key (room_id, client_id)
);

create index if not exists qreasee_peers_seen_at_idx on public.qreasee_peers (seen_at);
alter table public.qreasee_rooms enable row level security;
alter table public.qreasee_peers enable row level security;
revoke all on public.qreasee_rooms, public.qreasee_peers from anon, authenticated;

create or replace function public.qreasee_create_room(p_document jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_room uuid;
begin
  if p_document is null or pg_catalog.jsonb_typeof(p_document) <> 'object'
     or pg_catalog.jsonb_typeof(p_document->'objects') <> 'array'
     or pg_catalog.jsonb_typeof(p_document->'sheet') <> 'object'
     or pg_catalog.jsonb_array_length(p_document->'objects') > 250
     or pg_catalog.octet_length(p_document::text) > 1000000 then
    raise exception 'invalid_document';
  end if;
  insert into public.qreasee_rooms (document)
  values (pg_catalog.jsonb_set(p_document, '{revision}', '0'::jsonb))
  returning id into v_room;
  return v_room;
end;
$$;

create or replace function public.qreasee_exchange(
  p_room uuid,
  p_client uuid,
  p_name text,
  p_revision bigint,
  p_edit jsonb,
  p_cursor jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_document jsonb;
  v_next jsonb;
  v_before jsonb;
  v_after jsonb;
  v_object jsonb;
  v_current jsonb;
  v_objects jsonb;
  v_replacement jsonb;
  v_id text;
  v_peers jsonb;
begin
  if p_room is null or p_client is null or p_name is null
     or pg_catalog.char_length(p_name) > 40
     or pg_catalog.octet_length(coalesce(p_cursor::text, '')) > 1000
     or pg_catalog.octet_length(coalesce(p_edit::text, '')) > 1000000 then
    raise exception 'invalid_request';
  end if;

  if p_edit is null then
    select document into v_document from public.qreasee_rooms where id = p_room;
  else
    select document into v_document from public.qreasee_rooms where id = p_room for update;
  end if;
  if v_document is null then
    raise exception 'room_missing';
  end if;

  if p_edit is not null then
    if pg_catalog.jsonb_typeof(p_edit) <> 'object' then
      raise exception 'invalid_edit';
    end if;
    if p_edit->>'type' = 'sheet' then
      if v_document->'sheet' is distinct from p_edit->'before'
         or pg_catalog.jsonb_typeof(p_edit->'after') <> 'object' then
        raise exception 'conflict';
      end if;
      v_next := pg_catalog.jsonb_set(v_document, '{sheet}', p_edit->'after');
    elsif p_edit->>'type' in ('object', 'batch') then
      if p_edit->>'type' = 'object' then
        v_before := case when p_edit->'before' is null or p_edit->'before' = 'null'::jsonb
          then '[]'::jsonb else pg_catalog.jsonb_build_array(p_edit->'before') end;
        v_after := case when p_edit->'after' is null or p_edit->'after' = 'null'::jsonb
          then '[]'::jsonb else pg_catalog.jsonb_build_array(p_edit->'after') end;
      else
        v_before := p_edit->'before';
        v_after := p_edit->'after';
      end if;
      if pg_catalog.jsonb_typeof(v_before) <> 'array'
         or pg_catalog.jsonb_typeof(v_after) <> 'array'
         or pg_catalog.jsonb_array_length(v_before) + pg_catalog.jsonb_array_length(v_after) = 0
         or pg_catalog.jsonb_array_length(v_before) > 250
         or pg_catalog.jsonb_array_length(v_after) > 250 then
        raise exception 'invalid_edit';
      end if;

      -- Every old value must still match. Independent objects can merge.
      for v_object in select value from pg_catalog.jsonb_array_elements(v_before) loop
        v_id := v_object->>'id';
        if v_id is null or v_id = '' then raise exception 'invalid_edit'; end if;
        select value into v_current
          from pg_catalog.jsonb_array_elements(v_document->'objects')
          where value->>'id' = v_id limit 1;
        if v_current is distinct from v_object then raise exception 'conflict'; end if;
      end loop;

      for v_object in select value from pg_catalog.jsonb_array_elements(v_after) loop
        v_id := v_object->>'id';
        if v_id is null or v_id = '' or pg_catalog.jsonb_typeof(v_object) <> 'object'
           then raise exception 'invalid_edit'; end if;
        if not exists (select 1 from pg_catalog.jsonb_array_elements(v_before)
                       where value->>'id' = v_id)
           and exists (select 1 from pg_catalog.jsonb_array_elements(v_document->'objects')
                       where value->>'id' = v_id) then
          raise exception 'conflict';
        end if;
      end loop;

      if (select count(*) from pg_catalog.jsonb_array_elements(v_before))
         <> (select count(distinct value->>'id') from pg_catalog.jsonb_array_elements(v_before))
         or (select count(*) from pg_catalog.jsonb_array_elements(v_after))
         <> (select count(distinct value->>'id') from pg_catalog.jsonb_array_elements(v_after)) then
        raise exception 'invalid_edit';
      end if;

      v_objects := '[]'::jsonb;
      for v_object in select original.value
        from pg_catalog.jsonb_array_elements(v_document->'objects') as original(value) loop
        if exists (select 1 from pg_catalog.jsonb_array_elements(v_before) as b(value)
                   where b.value->>'id' = v_object->>'id') then
          select a.value into v_replacement
            from pg_catalog.jsonb_array_elements(v_after) as a(value)
            where a.value->>'id' = v_object->>'id' limit 1;
          if found then v_objects := v_objects || pg_catalog.jsonb_build_array(v_replacement); end if;
        else
          v_objects := v_objects || pg_catalog.jsonb_build_array(v_object);
        end if;
      end loop;
      for v_object in select a.value from pg_catalog.jsonb_array_elements(v_after) as a(value) loop
        if not exists (select 1 from pg_catalog.jsonb_array_elements(v_before) as b(value)
                       where b.value->>'id' = v_object->>'id') then
          v_objects := v_objects || pg_catalog.jsonb_build_array(v_object);
        end if;
      end loop;
      if pg_catalog.jsonb_array_length(v_objects) > 250 then
        raise exception 'object_limit';
      end if;
      v_next := pg_catalog.jsonb_set(v_document, '{objects}', v_objects);
    else
      raise exception 'invalid_edit';
    end if;

    v_document := pg_catalog.jsonb_set(v_next, '{revision}',
      pg_catalog.to_jsonb((v_document->>'revision')::bigint + 1));
    update public.qreasee_rooms
      set document = v_document, updated_at = pg_catalog.now() where id = p_room;
  end if;

  insert into public.qreasee_peers (room_id, client_id, name, cursor, seen_at)
  values (p_room, p_client, p_name, p_cursor, pg_catalog.now())
  on conflict (room_id, client_id) do update
    set name = excluded.name, cursor = excluded.cursor, seen_at = excluded.seen_at;
  delete from public.qreasee_peers
    where room_id = p_room and seen_at < pg_catalog.now() - interval '1 minute';
  select coalesce(pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object(
    'id', client_id, 'name', name, 'cursor', cursor)), '[]'::jsonb)
    into v_peers from public.qreasee_peers
    where room_id = p_room and seen_at > pg_catalog.now() - interval '15 seconds';

  return pg_catalog.jsonb_build_object(
    'document', case when p_edit is not null or p_revision is distinct from
      (v_document->>'revision')::bigint then v_document else null end,
    'peers', v_peers);
end;
$$;

revoke all on function public.qreasee_create_room(jsonb) from public;
revoke all on function public.qreasee_exchange(uuid, uuid, text, bigint, jsonb, jsonb) from public;
grant execute on function public.qreasee_create_room(jsonb) to anon, authenticated;
grant execute on function public.qreasee_exchange(uuid, uuid, text, bigint, jsonb, jsonb) to anon, authenticated;
