import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MarketingLayout, StudentLayout, AdminLayout } from './components/Layout';
import Home from './pages/Home';
import { CoursesPage, CourseDetailPage } from './pages/Courses';
import { AboutPage, FAQPage, ContactPage, PrivacyPage, TermsPage, RefundPolicyPage } from './pages/StaticPages';
import { LoginPage, RegisterPage, ResetPasswordPage } from './pages/Auth';
import { CheckoutPage, PaymentSuccessPage, PaymentPendingPage, PaymentFailedPage } from './pages/Checkout';
import { StudentDashboard, StudentCohort, StudentProjects, StudentResources, StudentAnnouncements, StudentProfile } from './pages/StudentPortal';
import { AdminDashboard, AdminCourses, AdminEnrollments, AdminPayments, AdminProjects, AdminAnnouncements } from './pages/AdminPortal';
import { AdminCohorts } from './pages/AdminCohorts';
import { CohortProvider } from './lib/cohort-context';
import { EnrollmentProvider } from './lib/enrollment-context';
import { SubmissionsProvider } from './lib/submissions-context';
import { isSupabaseConfigured } from './lib/supabase/client';
import { 
  getCurrentUser, signIn, signUp, signOut, updateProfile as supabaseUpdateProfile,
  onAuthStateChange, type AuthUser 
} from './lib/supabase/auth';
import { USERS, type User } from './store';

// ============ AUTH CONTEXT ============

interface AuthContextType {
  user: User | null;
  supabaseUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { full_name: string; email: string; phone: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  supabaseUser: null,
  isAuthenticated: false,
  isLoading: true,
  isDemoMode: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateProfile: () => {},
});

export const useAuth = () => React.useContext(AuthContext);

// ============ AUTH PROVIDER ============

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isDemoMode = !isSupabaseConfigured();

  // Initialize auth state
  useEffect(() => {
    async function initAuth() {
      if (isDemoMode) {
        // Demo mode: check localStorage
        const stored = localStorage.getItem('heidekel_session');
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            localStorage.removeItem('heidekel_session');
          }
        }
        setIsLoading(false);
        return;
      }

      // Real Supabase mode
      try {
        const currentUser = await getCurrentUser();
        if (currentUser?.profile) {
          setSupabaseUser(currentUser);
          setUser({
            id: currentUser.id,
            email: currentUser.email,
            full_name: currentUser.profile.full_name,
            phone: currentUser.profile.phone || '',
            role: currentUser.profile.role,
            created_at: currentUser.profile.created_at,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();

    // Subscribe to auth state changes (Supabase mode only)
    if (!isDemoMode) {
      const { data: { subscription } } = onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const currentUser = await getCurrentUser();
          if (currentUser?.profile) {
            setSupabaseUser(currentUser);
            setUser({
              id: currentUser.id,
              email: currentUser.email,
              full_name: currentUser.profile.full_name,
              phone: currentUser.profile.phone || '',
              role: currentUser.profile.role,
              created_at: currentUser.profile.created_at,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setSupabaseUser(null);
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [isDemoMode]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    if (isDemoMode) {
      // Demo mode authentication
      await new Promise(resolve => setTimeout(resolve, 500));
      const demoUsers: Record<string, { password: string; user: User }> = {
        'student@example.com': { password: 'password123', user: USERS.find(u => u.email === 'student@example.com')! },
        'admin@heidekel.com': { password: 'admin123', user: USERS.find(u => u.email === 'admin@heidekel.com')! },
      };
      const entry = demoUsers[email];
      if (entry && entry.password === password) {
        setUser(entry.user);
        localStorage.setItem('heidekel_session', JSON.stringify(entry.user));
        return true;
      }
      return false;
    }

    // Real Supabase authentication
    try {
      await signIn(email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, [isDemoMode]);

  const register = useCallback(async (data: { full_name: string; email: string; phone: string; password: string }): Promise<boolean> => {
    const { email, password, full_name, phone } = data;
    if (isDemoMode) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (USERS.find(u => u.email === email)) return false;
      const newUser: User = {
        id: 'user-' + Date.now(),
        email,
        full_name,
        phone,
        role: 'student',
        created_at: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem('heidekel_session', JSON.stringify(newUser));
      return true;
    }

    // Real Supabase registration
    try {
      await signUp({ email, password, full_name, phone });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }, [isDemoMode]);

  const logout = useCallback(async () => {
    if (isDemoMode) {
      setUser(null);
      localStorage.removeItem('heidekel_session');
      return;
    }

    try {
      await signOut();
      setSupabaseUser(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [isDemoMode]);

  const updateProfile = useCallback((data: Partial<User>) => {
    if (isDemoMode) {
      setUser(prev => {
        if (!prev) return null;
        const updated = { ...prev, ...data };
        localStorage.setItem('heidekel_session', JSON.stringify(updated));
        return updated;
      });
      return;
    }

    // Real Supabase profile update
    supabaseUpdateProfile({
      full_name: data.full_name,
      phone: data.phone,
    }).then(() => {
      setUser(prev => prev ? { ...prev, ...data } : null);
    }).catch(error => {
      console.error('Profile update error:', error);
    });
  }, [isDemoMode]);

  return (
    <AuthContext.Provider value={{
      user,
      supabaseUser,
      isAuthenticated: !!user,
      isLoading,
      isDemoMode,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ============ APP ============

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CohortProvider>
          <EnrollmentProvider>
            <SubmissionsProvider>
              <Routes>
                {/* Marketing pages */}
                <Route element={<MarketingLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/courses/:slug" element={<CourseDetailPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/refund-policy" element={<RefundPolicyPage />} />
                </Route>

                {/* Auth pages */}
                <Route element={<MarketingLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>

                {/* Checkout & Payment */}
                <Route element={<MarketingLayout />}>
                  <Route path="/checkout/:cohortId" element={<CheckoutPage />} />
                  <Route path="/payment/success" element={<PaymentSuccessPage />} />
                  <Route path="/payment/pending" element={<PaymentPendingPage />} />
                  <Route path="/payment/failed" element={<PaymentFailedPage />} />
                </Route>

                {/* Student portal */}
                <Route element={<StudentLayout />}>
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/cohort" element={<StudentCohort />} />
                  <Route path="/student/projects" element={<StudentProjects />} />
                  <Route path="/student/resources" element={<StudentResources />} />
                  <Route path="/student/announcements" element={<StudentAnnouncements />} />
                  <Route path="/student/profile" element={<StudentProfile />} />
                </Route>

                {/* Admin portal */}
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/courses" element={<AdminCourses />} />
                  <Route path="/admin/cohorts" element={<AdminCohorts />} />
                  <Route path="/admin/enrollments" element={<AdminEnrollments />} />
                  <Route path="/admin/payments" element={<AdminPayments />} />
                  <Route path="/admin/projects" element={<AdminProjects />} />
                  <Route path="/admin/announcements" element={<AdminAnnouncements />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </SubmissionsProvider>
          </EnrollmentProvider>
        </CohortProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
