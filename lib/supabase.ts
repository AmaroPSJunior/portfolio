import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://db.argpbtnrywifvmyjtztw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'ey...placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
