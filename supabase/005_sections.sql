-- Section planes. Apply after 001-004.

alter table public.qreasee_rooms add column if not exists owner uuid;

create or replace function public.qreasee_create_room(p_document jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_room uuid;
  v_document jsonb;
begin
  if p_document is null or pg_catalog.jsonb_typeof(p_document) <> 'object'
     or pg_catalog.jsonb_typeof(p_document->'objects') <> 'array'
     or pg_catalog.jsonb_typeof(p_document->'sheet') <> 'object'
     or pg_catalog.jsonb_array_length(p_document->'objects') > 250
     or pg_catalog.octet_length(p_document::text) > 1000000 then
    raise exception 'invalid_document';
  end if;
  v_document := pg_catalog.jsonb_set(p_document, '{share}',
    coalesce(p_document->'share', '{"role":"edit"}'::jsonb));
  if pg_catalog.jsonb_typeof(v_document->'share') <> 'object'
     or coalesce(v_document->'share'->>'role', '') not in ('edit', 'comment', 'view') then
    raise exception 'invalid_document';
  end if;
  insert into public.qreasee_rooms (document, owner)
  values (pg_catalog.jsonb_set(v_document, '{revision}', '0'::jsonb), auth.uid())
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
  v_owner uuid;
  v_uid uuid;
  v_can_manage boolean;
  v_role text;
  v_next jsonb;
  v_before jsonb;
  v_after jsonb;
  v_object jsonb;
  v_current jsonb;
  v_objects jsonb;
  v_replacement jsonb;
  v_comments jsonb;
  v_comment jsonb;
  v_sections jsonb;
  v_section jsonb;
  v_id text;
  v_target text;
  v_parent text;
  v_peers jsonb;
begin
  if p_room is null or p_client is null or p_name is null
     or pg_catalog.char_length(p_name) > 40
     or pg_catalog.octet_length(coalesce(p_cursor::text, '')) > 1000
     or pg_catalog.octet_length(coalesce(p_edit::text, '')) > 1000000 then
    raise exception 'invalid_request';
  end if;

  if p_edit is null then
    select document, owner into v_document, v_owner
      from public.qreasee_rooms where id = p_room;
  else
    select document, owner into v_document, v_owner
      from public.qreasee_rooms where id = p_room for update;
  end if;
  if v_document is null then
    raise exception 'room_missing';
  end if;

  v_uid := auth.uid();
  v_can_manage := v_owner is null or v_owner = v_uid;
  v_role := case when v_owner is not null and v_owner = v_uid then 'edit'
    else coalesce(v_document->'share'->>'role', 'edit') end;

  if p_edit is not null then
    if pg_catalog.jsonb_typeof(p_edit) <> 'object' then
      raise exception 'invalid_edit';
    end if;
    if p_edit->>'type' = 'share' then
      if not v_can_manage then raise exception 'forbidden'; end if;
      v_before := p_edit->'before';
      v_after := p_edit->'after';
      if coalesce(v_document->'share', '{"role":"edit"}'::jsonb) is distinct from v_before
         or pg_catalog.jsonb_typeof(v_after) <> 'object'
         or coalesce(v_after->>'role', '') not in ('edit', 'comment', 'view') then
        raise exception 'invalid_share';
      end if;
      v_next := pg_catalog.jsonb_set(v_document, '{share}', v_after);
    elsif p_edit->>'type' in ('object', 'batch', 'comment', 'section') then
      if v_role = 'view' then raise exception 'read_only'; end if;
      if v_role = 'comment' and p_edit->>'type' <> 'comment' then
        raise exception 'comment_only';
      end if;

      if p_edit->>'type' = 'section' then
        v_before := p_edit->'before';
        v_after := p_edit->'after';
        v_sections := coalesce(v_document->'sections', '[]'::jsonb);
        if pg_catalog.jsonb_typeof(v_sections) <> 'array' then
          v_sections := '[]'::jsonb;
        end if;
        if v_after is not null and v_after <> 'null'::jsonb then
          if pg_catalog.jsonb_typeof(v_after) <> 'object'
             or coalesce(v_after->>'id', '') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
             or pg_catalog.char_length(pg_catalog.btrim(coalesce(v_after->>'name', ''))) not between 1 and 32
             or pg_catalog.char_length(pg_catalog.btrim(coalesce(v_after->>'symbol', ''))) not between 1 and 8
             or pg_catalog.jsonb_typeof(v_after->'origin') <> 'array'
             or pg_catalog.jsonb_array_length(v_after->'origin') <> 3
             or pg_catalog.jsonb_typeof(v_after->'normal') <> 'array'
             or pg_catalog.jsonb_array_length(v_after->'normal') <> 3
             or (v_after ? 'enabled' and pg_catalog.jsonb_typeof(v_after->'enabled') <> 'boolean') then
            raise exception 'invalid_section';
          end if;
          if v_before is null or v_before = 'null'::jsonb then
            if exists (select 1 from pg_catalog.jsonb_array_elements(v_sections) as item(value)
                       where item.value->>'id' = v_after->>'id') then
              raise exception 'conflict';
            end if;
            if pg_catalog.jsonb_array_length(v_sections) >= 12 then
              raise exception 'section_limit';
            end if;
            v_sections := v_sections || pg_catalog.jsonb_build_array(v_after);
          else
            if v_after->>'id' is distinct from v_before->>'id'
               or not exists (select 1 from pg_catalog.jsonb_array_elements(v_sections) as item(value)
                              where item.value = v_before) then
              raise exception 'conflict';
            end if;
            select coalesce(pg_catalog.jsonb_agg(
              case when item.value->>'id' = v_before->>'id' then v_after else item.value end), '[]'::jsonb)
              into v_sections
              from pg_catalog.jsonb_array_elements(v_sections) as item(value);
          end if;
        else
          if v_before is null or v_before = 'null'::jsonb
             or not exists (select 1 from pg_catalog.jsonb_array_elements(v_sections) as item(value)
                            where item.value = v_before) then
            raise exception 'conflict';
          end if;
          select coalesce(pg_catalog.jsonb_agg(item.value), '[]'::jsonb)
            into v_sections
            from pg_catalog.jsonb_array_elements(v_sections) as item(value)
            where item.value->>'id' <> v_before->>'id';
        end if;
        v_next := pg_catalog.jsonb_set(v_document, '{sections}', v_sections);
      elsif p_edit->>'type' = 'comment' then
        v_before := p_edit->'before';
        v_after := p_edit->'after';
        v_comments := coalesce(v_document->'comments', '[]'::jsonb);
        if pg_catalog.jsonb_typeof(v_comments) <> 'array' then
          v_comments := '[]'::jsonb;
        end if;
        if v_after is not null and v_after <> 'null'::jsonb then
          if pg_catalog.jsonb_typeof(v_after) <> 'object'
             or coalesce(v_after->>'id', '') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
             or coalesce(v_after->>'target', '') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
             or pg_catalog.char_length(pg_catalog.btrim(coalesce(v_after->>'author', ''))) not between 1 and 32
             or pg_catalog.char_length(pg_catalog.btrim(coalesce(v_after->>'text', ''))) not between 1 and 1000
             or coalesce(v_after->>'created_at', '') !~ '^[0-9]{1,15}$'
             or (v_after->>'created_at')::bigint <= 0 then
            raise exception 'invalid_comment';
          end if;
          if pg_catalog.jsonb_typeof(coalesce(v_after->'mentions', '[]'::jsonb)) <> 'array'
             or pg_catalog.jsonb_array_length(coalesce(v_after->'mentions', '[]'::jsonb)) > 16 then
            raise exception 'invalid_comment';
          end if;
          for v_comment in select value from pg_catalog.jsonb_array_elements(
            coalesce(v_after->'mentions', '[]'::jsonb)) loop
            if pg_catalog.jsonb_typeof(v_comment) <> 'string'
               or pg_catalog.char_length(pg_catalog.btrim(v_comment #>> '{}')) not between 1 and 32 then
              raise exception 'invalid_comment';
            end if;
          end loop;
          if v_after ? 'resolved'
             and pg_catalog.jsonb_typeof(v_after->'resolved') <> 'boolean' then
            raise exception 'invalid_comment';
          end if;
          v_parent := null;
          if v_after ? 'parent' and v_after->'parent' <> 'null'::jsonb then
            v_parent := v_after->>'parent';
            if coalesce(v_parent, '') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
              raise exception 'invalid_comment';
            end if;
            select value into v_comment
              from pg_catalog.jsonb_array_elements(v_comments)
              where value->>'id' = v_parent limit 1;
            if not found
               or v_comment->>'target' is distinct from v_after->>'target'
               or (v_comment ? 'parent' and v_comment->'parent' <> 'null'::jsonb) then
              raise exception 'invalid_comment';
            end if;
          end if;
          v_target := v_after->>'target';
          if not exists (
            select 1 from pg_catalog.jsonb_array_elements(v_document->'objects') as item(value)
            where item.value->>'id' = v_target
               or (pg_catalog.jsonb_typeof(item.value->'container') = 'object'
                   and item.value->'container'->>'id' = v_target)
          ) then
            raise exception 'invalid_target';
          end if;
          if v_before is null or v_before = 'null'::jsonb then
            if exists (select 1 from pg_catalog.jsonb_array_elements(v_comments) as item(value)
                       where item.value->>'id' = v_after->>'id') then
              raise exception 'conflict';
            end if;
            if pg_catalog.jsonb_array_length(v_comments) >= 200 then
              raise exception 'comment_limit';
            end if;
            v_comments := v_comments || pg_catalog.jsonb_build_array(v_after);
          else
            if v_after->>'id' is distinct from v_before->>'id'
               or v_after->'parent' is distinct from v_before->'parent'
               or v_after->>'target' is distinct from v_before->>'target'
               or not exists (select 1 from pg_catalog.jsonb_array_elements(v_comments) as item(value)
                              where item.value = v_before) then
              raise exception 'conflict';
            end if;
            select coalesce(pg_catalog.jsonb_agg(
              case when item.value->>'id' = v_before->>'id' then v_after else item.value end), '[]'::jsonb)
              into v_comments
              from pg_catalog.jsonb_array_elements(v_comments) as item(value);
          end if;
        else
          if v_before is null or v_before = 'null'::jsonb
             or not exists (select 1 from pg_catalog.jsonb_array_elements(v_comments) as item(value)
                            where item.value = v_before) then
            raise exception 'conflict';
          end if;
          select coalesce(pg_catalog.jsonb_agg(item.value), '[]'::jsonb)
            into v_comments
            from pg_catalog.jsonb_array_elements(v_comments) as item(value)
            where item.value->>'id' <> v_before->>'id'
              and item.value->>'parent' is distinct from v_before->>'id';
        end if;
        v_next := pg_catalog.jsonb_set(v_document, '{comments}', v_comments);
      else
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

        v_comments := coalesce(v_document->'comments', '[]'::jsonb);
        if pg_catalog.jsonb_typeof(v_comments) <> 'array' then
          v_comments := '[]'::jsonb;
        end if;
        select coalesce(pg_catalog.jsonb_agg(comment.value), '[]'::jsonb)
          into v_comments
          from pg_catalog.jsonb_array_elements(v_comments) as comment(value)
          where exists (
            select 1 from pg_catalog.jsonb_array_elements(v_objects) as item(value)
            where item.value->>'id' = comment.value->>'target'
               or (pg_catalog.jsonb_typeof(item.value->'container') = 'object'
                   and item.value->'container'->>'id' = comment.value->>'target')
          );
        v_next := pg_catalog.jsonb_set(
          pg_catalog.jsonb_set(v_document, '{objects}', v_objects), '{comments}', v_comments);
      end if;
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
    'peers', v_peers, 'can_manage', v_can_manage, 'role', v_role);
end;
$$;
