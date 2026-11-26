-- OWASP-oriented hardening for the Qreasee Supabase RPC surface.
-- Apply after 001-005.

alter table public.qreasee_rooms add column if not exists created_at timestamptz not null default now();

alter function public.qreasee_create_room(jsonb) set statement_timeout = '8s';
alter function public.qreasee_exchange(uuid, uuid, text, bigint, jsonb, jsonb) set statement_timeout = '8s';

revoke all on public.qreasee_rooms, public.qreasee_peers from anon, authenticated;
revoke all on function public.qreasee_create_room(jsonb) from public;
revoke all on function public.qreasee_exchange(uuid, uuid, text, bigint, jsonb, jsonb) from public;
revoke execute on function public.qreasee_create_room(jsonb) from anon;
revoke execute on function public.qreasee_exchange(uuid, uuid, text, bigint, jsonb, jsonb) from anon;
grant execute on function public.qreasee_create_room(jsonb) to authenticated;
grant execute on function public.qreasee_exchange(uuid, uuid, text, bigint, jsonb, jsonb) to authenticated;

create or replace function public.qreasee_create_room(p_document jsonb)
returns uuid
language plpgsql
security definer
set search_path = ''
set statement_timeout = '8s'
as $$
declare
  v_room uuid;
  v_document jsonb;
  v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'login_required'; end if;
  if p_document is null or pg_catalog.jsonb_typeof(p_document) <> 'object'
     or pg_catalog.jsonb_typeof(p_document->'objects') <> 'array'
     or pg_catalog.jsonb_typeof(p_document->'sheet') <> 'object'
     or pg_catalog.jsonb_array_length(p_document->'objects') > 250
     or pg_catalog.octet_length(p_document::text) > 1000000 then
    raise exception 'invalid_document';
  end if;
  if (select count(*) from public.qreasee_rooms where owner = v_uid) >= 200 then
    raise exception 'room_limit';
  end if;
  if (select count(*) from public.qreasee_rooms
      where owner = v_uid and created_at > pg_catalog.now() - interval '1 minute') >= 12 then
    raise exception 'rate_limited';
  end if;
  v_document := pg_catalog.jsonb_set(p_document, '{share}',
    coalesce(p_document->'share', '{"role":"edit"}'::jsonb));
  if pg_catalog.jsonb_typeof(v_document->'share') <> 'object'
     or coalesce(v_document->'share'->>'role', '') not in ('edit', 'comment', 'view') then
    raise exception 'invalid_document';
  end if;
  insert into public.qreasee_rooms (document, owner)
  values (pg_catalog.jsonb_set(v_document, '{revision}', '0'::jsonb), v_uid)
  returning id into v_room;
  return v_room;
end;
$$;
