import { useState, useEffect, useCallback } from 'react';
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
import { AuthContext, USERS, type User } from './store';

// ============ AUTH PROVIDER ============

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const stored = localStorage.getItem('heidekel_session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem('heidekel_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 500));

    // Demo credentials
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
  }, []);

  const register = useCallback(async (data: { full_name: string; email: string; phone: string; password: string }): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if email already exists
    if (USERS.find(u => u.email === data.email)) {
      return false;
    }

    const newUser: User = {
      id: 'user-' + Date.now(),
      email: data.email,
      full_name: data.full_name,
      phone: data.phone,
      role: 'student',
      created_at: new Date().toISOString(),
    };

    setUser(newUser);
    localStorage.setItem('heidekel_session', JSON.stringify(newUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('heidekel_session');
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem('heidekel_session', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
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
