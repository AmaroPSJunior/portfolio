import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://argpbtnrywifvmyjtztw.supabase.co';
const supabaseUrl = rawUrl.replace('https://db.', 'https://');
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_-3cyrTh9HS3VAqQhIwaydw_XUpFJ8JO';

const createTestSafeSupabaseClient = () => {
  const okResult = { data: null, error: null };

  const makeQuery = (data: any = []) => ({
    data,
    error: null,
    maybeSingle: async () => ({ data: Array.isArray(data) ? data[0] ?? null : data, error: null }),
    single: async () => ({ data: Array.isArray(data) ? data[0] ?? null : data, error: null }),
    select: () => ({
      eq: () => ({
        maybeSingle: async () => ({ data: Array.isArray(data) ? data[0] ?? null : data, error: null }),
        single: async () => ({ data: Array.isArray(data) ? data[0] ?? null : data, error: null }),
        order: () => ({
          limit: async () => ({ data, error: null }),
          data,
          error: null,
        }),
        data,
        error: null,
      }),
      order: () => ({
        limit: async () => ({ data, error: null }),
        data,
        error: null,
      }),
      data,
      error: null,
      maybeSingle: async () => ({ data: Array.isArray(data) ? data[0] ?? null : data, error: null }),
      single: async () => ({ data: Array.isArray(data) ? data[0] ?? null : data, error: null }),
    }),
    order: () => ({
      limit: async () => ({ data, error: null }),
      data,
      error: null,
    }),
    eq: () => ({
      maybeSingle: async () => ({ data: Array.isArray(data) ? data[0] ?? null : data, error: null }),
      single: async () => ({ data: Array.isArray(data) ? data[0] ?? null : data, error: null }),
      data,
      error: null,
    }),
  });

  return {
    from: () => ({
      select: () => makeQuery(),
      insert: () => ({
        select: async () => okResult,
      }),
      upsert: () => ({
        select: () => ({
          single: async () => okResult,
        }),
      }),
      update: () => ({
        eq: async () => okResult,
      }),
      delete: () => ({
        eq: async () => okResult,
      }),
      eq: () => ({
        maybeSingle: async () => okResult,
        single: async () => okResult,
      }),
    }),
  };
};

const isTestEnvironment = process.env.NODE_ENV === 'test';

export const supabase = isTestEnvironment
  ? createTestSafeSupabaseClient() as any
  : createClient(supabaseUrl, supabaseAnonKey);

