import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { COHORTS, COURSES, type Cohort, type Session } from '../store';

// ============ TYPES ============

export interface CohortFormData {
  course_id: string;
  name: string;
  start_date: string;
  end_date: string;
  enrollment_deadline: string;
  capacity: number;
  status: Cohort['status'];
}

export interface SessionFormData {
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  meeting_url: string;
}

interface CohortContextType {
  cohorts: Cohort[];
  getCohort: (id: string) => Cohort | undefined;
  getCohortsByCourse: (courseId: string) => Cohort[];
  createCohort: (data: CohortFormData) => Cohort;
  updateCohort: (id: string, data: Partial<CohortFormData>) => Cohort | null;
  deleteCohort: (id: string) => boolean;
  addSession: (cohortId: string, data: SessionFormData) => Session | null;
  updateSession: (cohortId: string, sessionId: string, data: Partial<SessionFormData>) => boolean;
  deleteSession: (cohortId: string, sessionId: string) => boolean;
  canEnroll: (cohortId: string, studentId: string, enrolledCount?: number) => { allowed: boolean; reason?: string };
}

const CohortContext = createContext<CohortContextType | null>(null);

// ============ PROVIDER ============

export function CohortProvider({ children }: { children: ReactNode }) {
  const [cohorts, setCohorts] = useState<Cohort[]>([...COHORTS]);

  const getCohort = useCallback((id: string) => {
    return cohorts.find(c => c.id === id);
  }, [cohorts]);

  const getCohortsByCourse = useCallback((courseId: string) => {
    return cohorts.filter(c => c.course_id === courseId);
  }, [cohorts]);

  const createCohort = useCallback((data: CohortFormData): Cohort => {
    const newCohort: Cohort = {
      id: `cohort-${Date.now()}`,
      course_id: data.course_id,
      name: data.name,
      start_date: data.start_date,
      end_date: data.end_date,
      enrollment_deadline: data.enrollment_deadline,
      capacity: data.capacity,
      enrolled_count: 0,
      status: data.status,
      sessions: [],
      created_at: new Date().toISOString(),
    };
    setCohorts(prev => [...prev, newCohort]);
    return newCohort;
  }, []);

  const updateCohort = useCallback((id: string, data: Partial<CohortFormData>): Cohort | null => {
    let updated: Cohort | null = null;
    setCohorts(prev => prev.map(c => {
      if (c.id === id) {
        updated = { ...c, ...data };
        return updated;
      }
      return c;
    }));
    return updated;
  }, []);

  const deleteCohort = useCallback((id: string): boolean => {
    const cohort = cohorts.find(c => c.id === id);
    if (!cohort) return false;
    // Prevent deletion if there are enrolled students
    if (cohort.enrolled_count > 0) return false;
    setCohorts(prev => prev.filter(c => c.id !== id));
    return true;
  }, [cohorts]);

  const addSession = useCallback((cohortId: string, data: SessionFormData): Session | null => {
    const cohort = cohorts.find(c => c.id === cohortId);
    if (!cohort) return null;

    const newSession: Session = {
      id: `session-${Date.now()}`,
      cohort_id: cohortId,
      title: data.title,
      description: data.description,
      starts_at: data.starts_at,
      ends_at: data.ends_at,
      meeting_url: data.meeting_url || null,
      resource_path: null,
    };

    setCohorts(prev => prev.map(c => {
      if (c.id === cohortId) {
        return { ...c, sessions: [...c.sessions, newSession] };
      }
      return c;
    }));

    return newSession;
  }, [cohorts]);

  const updateSession = useCallback((cohortId: string, sessionId: string, data: Partial<SessionFormData>): boolean => {
    let found = false;
    setCohorts(prev => prev.map(c => {
      if (c.id === cohortId) {
        const sessions = c.sessions.map(s => {
          if (s.id === sessionId) {
            found = true;
            return { ...s, ...data };
          }
          return s;
        });
        return { ...c, sessions };
      }
      return c;
    }));
    return found;
  }, []);

  const deleteSession = useCallback((cohortId: string, sessionId: string): boolean => {
    let found = false;
    setCohorts(prev => prev.map(c => {
      if (c.id === cohortId) {
        const originalLength = c.sessions.length;
        const sessions = c.sessions.filter(s => s.id !== sessionId);
        found = sessions.length < originalLength;
        return { ...c, sessions };
      }
      return c;
    }));
    return found;
  }, []);

  const canEnroll = useCallback((cohortId: string, studentId: string, enrolledCount?: number): { allowed: boolean; reason?: string } => {
    const cohort = cohorts.find(c => c.id === cohortId);
    if (!cohort) {
      return { allowed: false, reason: 'Cohort not found' };
    }

    // Check status
    if (cohort.status === 'draft') {
      return { allowed: false, reason: 'This cohort is not yet open for enrollment' };
    }
    if (cohort.status === 'cancelled') {
      return { allowed: false, reason: 'This cohort has been cancelled' };
    }
    if (cohort.status === 'completed') {
      return { allowed: false, reason: 'This cohort has already ended' };
    }

    // Check capacity (use provided count or cohort's count)
    const currentCount = enrolledCount ?? cohort.enrolled_count;
    if (currentCount >= cohort.capacity) {
      return { allowed: false, reason: 'This cohort is full' };
    }

    // Check enrollment deadline
    const now = new Date();
    const deadline = new Date(cohort.enrollment_deadline);
    if (now > deadline) {
      return { allowed: false, reason: 'Enrollment deadline has passed' };
    }

    // Note: Duplicate enrollment check is handled by the EnrollmentContext
    // This context focuses on cohort availability; enrollment state is separate.

    return { allowed: true };
  }, [cohorts]);

  return (
    <CohortContext.Provider value={{
      cohorts,
      getCohort,
      getCohortsByCourse,
      createCohort,
      updateCohort,
      deleteCohort,
      addSession,
      updateSession,
      deleteSession,
      canEnroll,
    }}>
      {children}
    </CohortContext.Provider>
  );
}

export function useCohorts() {
  const context = useContext(CohortContext);
  if (!context) {
    throw new Error('useCohorts must be used within a CohortProvider');
  }
  return context;
}
