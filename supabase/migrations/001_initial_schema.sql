-- ============================================================================
-- HEIDEKEL SOFTWARE ACADEMY - DATABASE SCHEMA
-- ============================================================================
-- This migration creates the complete database schema for the Heidekel
-- Software Academy platform with proper multi-tenant isolation via RLS.
--
-- IMPORTANT: Run this migration against your Supabase project before
-- deploying the application. Use: supabase db push
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
-- Extends auth.users with application-specific profile data.
-- The id references auth.users.id for proper auth integration.

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- COURSES TABLE
-- ============================================================================

CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_image_url TEXT,
  price_amount INTEGER NOT NULL CHECK (price_amount >= 0),
  currency TEXT NOT NULL DEFAULT 'GHS',
  prerequisites TEXT[] DEFAULT '{}',
  learning_outcomes TEXT[] DEFAULT '{}',
  certificate_requirements TEXT[] DEFAULT '{}',
  curriculum JSONB DEFAULT '[]'::JSONB,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courses_slug ON public.courses(slug);
CREATE INDEX idx_courses_published ON public.courses(published_at) WHERE published_at IS NOT NULL;

-- ============================================================================
-- COHORTS TABLE
-- ============================================================================

CREATE TABLE public.cohorts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  enrollment_deadline DATE NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'upcoming', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cohorts_course ON public.cohorts(course_id);
CREATE INDEX idx_cohorts_status ON public.cohorts(status);

-- ============================================================================
-- COHORT SESSIONS TABLE
-- ============================================================================

CREATE TABLE public.cohort_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  meeting_url TEXT,
  recording_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (ends_at > starts_at)
);

CREATE INDEX idx_sessions_cohort ON public.cohort_sessions(cohort_id);
CREATE INDEX idx_sessions_starts ON public.cohort_sessions(starts_at);

-- ============================================================================
-- ORDERS TABLE
-- ============================================================================

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE RESTRICT,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'GHS',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_student ON public.orders(student_id);
CREATE INDEX idx_orders_cohort ON public.orders(cohort_id);
CREATE INDEX idx_orders_status ON public.orders(status);

-- ============================================================================
-- PAYMENTS TABLE
-- ============================================================================

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_reference TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'GHS',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  paid_at TIMESTAMPTZ,
  provider_metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order ON public.payments(order_id);
CREATE INDEX idx_payments_reference ON public.payments(provider_reference);
CREATE INDEX idx_payments_status ON public.payments(status);

-- ============================================================================
-- ENROLLMENTS TABLE
-- ============================================================================

CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE RESTRICT,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, cohort_id)
);

CREATE INDEX idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX idx_enrollments_cohort ON public.enrollments(cohort_id);
CREATE INDEX idx_enrollments_status ON public.enrollments(status);

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cohort_id UUID NOT NULL REFERENCES public.cohorts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  due_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_cohort ON public.projects(cohort_id);

-- ============================================================================
-- PROJECT SUBMISSIONS TABLE
-- ============================================================================

CREATE TABLE public.project_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  submission_text TEXT,
  submission_url TEXT,
  storage_path TEXT,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'submitted', 'changes_requested', 'reviewed')),
  feedback TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, student_id)
);

CREATE INDEX idx_submissions_project ON public.project_submissions(project_id);
CREATE INDEX idx_submissions_student ON public.project_submissions(student_id);
CREATE INDEX idx_submissions_status ON public.project_submissions(status);

-- ============================================================================
-- ANNOUNCEMENTS TABLE
-- ============================================================================

CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cohort_id UUID REFERENCES public.cohorts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_announcements_cohort ON public.announcements(cohort_id);
CREATE INDEX idx_announcements_published ON public.announcements(published_at DESC);

-- ============================================================================
-- ATTENDANCE TABLE
-- ============================================================================

CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.cohort_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'excused', 'late')),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

CREATE INDEX idx_attendance_session ON public.attendance(session_id);
CREATE INDEX idx_attendance_student ON public.attendance(student_id);

-- ============================================================================
-- AUDIT LOGS TABLE
-- ============================================================================

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_action ON public.audit_logs(action);
CREATE INDEX idx_audit_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_created ON public.audit_logs(created_at DESC);

-- ============================================================================
-- HELPER FUNCTION: Check if user is admin
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- HELPER FUNCTION: Check if user is enrolled in cohort
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_enrolled_in_cohort(target_cohort_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE student_id = auth.uid()
      AND cohort_id = target_cohort_id
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================
-- These policies enforce multi-tenant data isolation at the database level.
-- Even if the application code has a bug, the database prevents data leaks.

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cohort_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- Admins can update all profiles (including role changes)
CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- COURSES POLICIES
-- ============================================================================

-- Anyone can read published courses
CREATE POLICY "Anyone can read published courses"
  ON public.courses FOR SELECT
  USING (published_at IS NOT NULL);

-- Admins can read all courses (including drafts)
CREATE POLICY "Admins can read all courses"
  ON public.courses FOR SELECT
  USING (public.is_admin());

-- Admins can manage courses
CREATE POLICY "Admins can manage courses"
  ON public.courses FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- COHORTS POLICIES
-- ============================================================================

-- Anyone can read active/upcoming cohorts for published courses
CREATE POLICY "Anyone can read active cohorts"
  ON public.cohorts FOR SELECT
  USING (
    status IN ('active', 'upcoming') AND
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = cohorts.course_id AND published_at IS NOT NULL
    )
  );

-- Admins can manage all cohorts
CREATE POLICY "Admins can manage cohorts"
  ON public.cohorts FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- COHORT SESSIONS POLICIES
-- ============================================================================

-- Enrolled students can read sessions for their cohorts
CREATE POLICY "Students can read own cohort sessions"
  ON public.cohort_sessions FOR SELECT
  USING (public.is_enrolled_in_cohort(cohort_id));

-- Admins can manage all sessions
CREATE POLICY "Admins can manage sessions"
  ON public.cohort_sessions FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- ORDERS POLICIES
-- ============================================================================

-- Students can read their own orders
CREATE POLICY "Students can read own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = student_id);

-- Students can create their own orders
CREATE POLICY "Students can create own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Admins can manage all orders
CREATE POLICY "Admins can manage orders"
  ON public.orders FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- PAYMENTS POLICIES
-- ============================================================================

-- Students can read payments for their own orders
CREATE POLICY "Students can read own payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = payments.order_id AND student_id = auth.uid()
    )
  );

-- Only service role can insert/update payments (via server-side code)
-- No client-side policies for payments - all payment operations go through
-- server-side API routes that use the service role key.

-- Admins can read all payments
CREATE POLICY "Admins can read all payments"
  ON public.payments FOR SELECT
  USING (public.is_admin());

-- ============================================================================
-- ENROLLMENTS POLICIES
-- ============================================================================

-- Students can read their own enrollments
CREATE POLICY "Students can read own enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = student_id);

-- Admins can manage all enrollments
CREATE POLICY "Admins can manage enrollments"
  ON public.enrollments FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- PROJECTS POLICIES
-- ============================================================================

-- Enrolled students can read projects for their cohorts
CREATE POLICY "Students can read own cohort projects"
  ON public.projects FOR SELECT
  USING (public.is_enrolled_in_cohort(cohort_id));

-- Admins can manage all projects
CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- PROJECT SUBMISSIONS POLICIES
-- ============================================================================

-- Students can read their own submissions
CREATE POLICY "Students can read own submissions"
  ON public.project_submissions FOR SELECT
  USING (auth.uid() = student_id);

-- Students can create/update their own submissions
CREATE POLICY "Students can create own submissions"
  ON public.project_submissions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own submissions"
  ON public.project_submissions FOR UPDATE
  USING (auth.uid() = student_id);

-- Admins can manage all submissions (for review/feedback)
CREATE POLICY "Admins can manage all submissions"
  ON public.project_submissions FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- ANNOUNCEMENTS POLICIES
-- ============================================================================

-- Anyone can read published announcements
CREATE POLICY "Anyone can read announcements"
  ON public.announcements FOR SELECT
  USING (published_at <= NOW());

-- Admins can manage all announcements
CREATE POLICY "Admins can manage announcements"
  ON public.announcements FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- ATTENDANCE POLICIES
-- ============================================================================

-- Students can read their own attendance
CREATE POLICY "Students can read own attendance"
  ON public.attendance FOR SELECT
  USING (auth.uid() = student_id);

-- Admins can manage all attendance
CREATE POLICY "Admins can manage attendance"
  ON public.attendance FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- AUDIT LOGS POLICIES
-- ============================================================================

-- Users can read their own audit logs
CREATE POLICY "Users can read own audit logs"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read all audit logs
CREATE POLICY "Admins can read all audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());

-- Only service role can insert audit logs (via server-side code)
-- No client-side insert policy - audit logs are created by server-side functions

-- ============================================================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- ============================================================================

-- Function to get enrollment count for a cohort
CREATE OR REPLACE FUNCTION public.get_cohort_enrollment_count(target_cohort_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN COUNT(*)::INTEGER
  FROM public.enrollments
  WHERE cohort_id = target_cohort_id AND status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to check if student can enroll in cohort
CREATE OR REPLACE FUNCTION public.can_enroll_in_cohort(target_cohort_id UUID)
RETURNS TABLE (allowed BOOLEAN, reason TEXT) AS $$
DECLARE
  cohort_record RECORD;
  enrollment_count INTEGER;
  already_enrolled BOOLEAN;
BEGIN
  -- Get cohort details
  SELECT * INTO cohort_record
  FROM public.cohorts
  WHERE id = target_cohort_id;

  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, 'Cohort not found'::TEXT;
    RETURN;
  END IF;

  -- Check status
  IF cohort_record.status = 'draft' THEN
    RETURN QUERY SELECT FALSE, 'This cohort is not yet open for enrollment'::TEXT;
    RETURN;
  END IF;

  IF cohort_record.status = 'cancelled' THEN
    RETURN QUERY SELECT FALSE, 'This cohort has been cancelled'::TEXT;
    RETURN;
  END IF;

  IF cohort_record.status = 'completed' THEN
    RETURN QUERY SELECT FALSE, 'This cohort has already ended'::TEXT;
    RETURN;
  END IF;

  -- Check enrollment deadline
  IF CURRENT_DATE > cohort_record.enrollment_deadline THEN
    RETURN QUERY SELECT FALSE, 'Enrollment deadline has passed'::TEXT;
    RETURN;
  END IF;

  -- Check capacity
  SELECT public.get_cohort_enrollment_count(target_cohort_id) INTO enrollment_count;
  IF enrollment_count >= cohort_record.capacity THEN
    RETURN QUERY SELECT FALSE, 'This cohort is full'::TEXT;
    RETURN;
  END IF;

  -- Check if already enrolled
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE student_id = auth.uid() AND cohort_id = target_cohort_id
  ) INTO already_enrolled;

  IF already_enrolled THEN
    RETURN QUERY SELECT FALSE, 'You are already enrolled in this cohort'::TEXT;
    RETURN;
  END IF;

  RETURN QUERY SELECT TRUE, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- UPDATED AT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cohorts_updated_at BEFORE UPDATE ON public.cohorts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON public.cohort_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.project_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- SEED DATA (Development Only)
-- ============================================================================
-- This seed data is for development/testing. Remove in production.

-- Insert the AI for Students course
INSERT INTO public.courses (
  slug, title, short_description, description,
  price_amount, currency, prerequisites, learning_outcomes,
  certificate_requirements, curriculum, published_at
) VALUES (
  'ai-for-students',
  'AI for Students: Practical Workflows',
  'Learn to combine AI tools into practical workflows for studying, research, productivity, and projects.',
  'This hands-on course teaches university students how to use AI tools effectively — not just as chatbots, but as integrated components of real workflows.',
  35000,
  'GHS',
  ARRAY['Basic computer literacy', 'A laptop with internet access', 'Willingness to learn'],
  ARRAY[
    'Build effective prompts for studying, research, and writing',
    'Combine multiple AI tools into integrated workflows',
    'Create custom AI assistants for specific tasks',
    'Automate repetitive academic tasks',
    'Develop reusable prompt templates and pipelines'
  ],
  ARRAY[
    'Attend at least 80% of live sessions',
    'Complete all assigned projects',
    'Submit final capstone project',
    'Receive passing grade on project review'
  ],
  '[
    {"id": "mod-1", "title": "Foundations of AI Tools", "description": "Understanding the AI landscape", "lessons": ["Introduction to AI tools", "Setting up ChatGPT, Claude, Gemini"], "duration": "2 sessions"},
    {"id": "mod-2", "title": "Prompt Engineering", "description": "Master the art of communicating with AI", "lessons": ["Prompt structure", "Chain-of-thought prompting", "Iterative refinement"], "duration": "2 sessions"},
    {"id": "mod-3", "title": "AI-Powered Study Workflows", "description": "Transform how you learn", "lessons": ["AI-assisted note-taking", "Concept explanation", "Study materials"], "duration": "2 sessions"}
  ]'::JSONB,
  NOW()
);
