import { createBrowserClient } from '@supabase/ssr';

/**
 * Create a Supabase client for browser-side operations.
 * 
 * This client uses the anon key which is safe to expose in frontend code.
 * All security is enforced via Row Level Security (RLS) policies in the database.
 * 
 * The client automatically handles:
 * - Session persistence (via cookies in Next.js, localStorage in Vite)
 * - Token refresh
 * - Auth state changes
 */
export function createClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. ' +
      'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file. ' +
      'See .env.example for reference.'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://your-project-id.supabase.co'
  );
}

/**
 * Get Supabase configuration status
 */
export function getSupabaseStatus(): {
  configured: boolean;
  mode: 'production' | 'development' | 'demo';
  message: string;
} {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      mode: 'demo',
      message: 'Supabase is not configured. Running in demo mode with mock data.',
    };
  }

  const url = import.meta.env.VITE_SUPABASE_URL;
  const isProduction = !url.includes('.supabase.co') || url.includes('live');

  return {
    configured: true,
    mode: isProduction ? 'production' : 'development',
    message: isProduction
      ? 'Connected to production Supabase instance'
      : 'Connected to development Supabase instance',
  };
}
