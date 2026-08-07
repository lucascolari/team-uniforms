import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Valores del proyecto (Project Settings -> API). La clave publishable es pública
// por diseño; la seguridad la garantiza el Row Level Security (RLS).
const SUPABASE_URL = 'https://ktdabgwjugfjudgtnpbp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_vEgQBcigBa_ur_6Z4a7oIg_7o-kQCNh';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
