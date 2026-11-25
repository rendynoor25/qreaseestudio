-- Apply immediately before publishing a build with QREASEE_AUTH_DEMO=1.
-- This requires a Supabase Auth session for room creation and exchange.
-- The room link remains an edit capability among signed-in users.

revoke execute on function public.qreasee_create_room(jsonb) from anon;
revoke execute on function public.qreasee_exchange(uuid, uuid, text, bigint, jsonb, jsonb) from anon;
grant execute on function public.qreasee_create_room(jsonb) to authenticated;
grant execute on function public.qreasee_exchange(uuid, uuid, text, bigint, jsonb, jsonb) to authenticated;
