import { createClient } from './client';
import type { Database } from './types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

/**
 * Authentication helpers for Supabase Auth
 * 
 * These functions wrap Supabase auth operations with proper error handling
 * and type safety. All auth state is managed by Supabase - we just provide
 * a clean API for the frontend.
 */

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  profile: Profile | null;
}

/**
 * Sign up a new user
 * Creates auth.users record and triggers profile creation via DB trigger
 */
export async function signUp( { email, password, full_name, phone }: SignUpData) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        phone: phone || null,
        role: 'student', // Always student on signup - admins are provisioned separately
      },
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get the current authenticated user with their profile
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch the profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    id: user.id,
    email: user.email!,
    profile: profile as Profile | null,
  };
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Request a password reset email
 */
export async function resetPassword(email: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
}

/**
 * Update the user's password (after reset)
 */
export async function updatePassword(newPassword: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}

/**
 * Update the user's profile
 */
export async function updateProfile(updates: { full_name?: string; phone?: string | null }) {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
  if (updates.full_name !== undefined) updateData.full_name = updates.full_name;
  if (updates.phone !== undefined) updateData.phone = updates.phone;

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Subscribe to auth state changes
 * Returns an unsubscribe function
 */
export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  const supabase = createClient();

  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.profile?.role === 'admin';
}

/**
 * Provision an admin user (requires existing admin auth)
 * This is the secure way to create admin accounts - not via public signup
 */
export async function provisionAdmin(userId: string) {
  const supabase = createClient();

  // This requires the service role key, so it must be done server-side
  // This function is a placeholder - implement in your API routes
  throw new Error(
    'Admin provisioning must be done server-side using the service role key. ' +
    'Create an API route that calls supabase.admin.updateUserById(userId, { role: "admin" })'
  );
}
