import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://argpbtnrywifvmyjtztw.supabase.co';
// Ensure URL points to the HTTPS REST API endpoint, not the raw db. postgres hostname
const supabaseUrl = rawUrl.replace('https://db.', 'https://');
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_-3cyrTh9HS3VAqQhIwaydw_XUpFJ8JO';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

