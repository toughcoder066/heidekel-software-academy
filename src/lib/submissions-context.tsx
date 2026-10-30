import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PROJECTS, type Project, type ProjectSubmission } from '../store';

// ============ TYPES ============

export interface CreateSubmissionInput {
  project_id: string;
  student_id: string;
  submission_text?: string;
  submission_url?: string;
  storage_path?: string;
}

export interface SubmissionFeedback {
  submission_id: string;
  feedback: string;
  status: 'changes_requested' | 'reviewed';
  reviewed_by: string;
}

interface SubmissionsContextType {
  // Projects
  projects: Project[];
  getProject: (id: string) => Project | undefined;
  getProjectsByCohort: (cohortId: string) => Project[];
  createProject: (project: Omit<Project, 'id' | 'created_at'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => boolean;
  
  // Submissions
  submissions: ProjectSubmission[];
  getSubmissionByStudentAndProject: (studentId: string, projectId: string) => ProjectSubmission | undefined;
  getSubmissionsByProject: (projectId: string) => ProjectSubmission[];
  getSubmissionsByStudent: (studentId: string) => ProjectSubmission[];
  createSubmission: (input: CreateSubmissionInput) => ProjectSubmission;
  updateSubmission: (id: string, updates: Partial<ProjectSubmission>) => void;
  submitFeedback: (feedback: SubmissionFeedback) => void;
  
  // Stats
  getSubmissionCount: (projectId: string) => number;
  getPendingReviewCount: () => number;
}

const SubmissionsContext = createContext<SubmissionsContextType | null>(null);

// ============ PROVIDER ============

export function SubmissionsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([...PROJECTS]);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);

  // ---- Projects ----

  const getProject = useCallback((id: string) => {
    return projects.find(p => p.id === id);
  }, [projects]);

  const getProjectsByCohort = useCallback((cohortId: string) => {
    return projects.filter(p => p.cohort_id === cohortId);
  }, [projects]);

  const createProject = useCallback((project: Omit<Project, 'id'>): Project => {
    const newProject: Project = {
      ...project,
      id: `proj-${Date.now()}`,
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProject = useCallback((id: string): boolean => {
    const hasSubmissions = submissions.some(s => s.project_id === id);
    if (hasSubmissions) return false;
    setProjects(prev => prev.filter(p => p.id !== id));
    return true;
  }, [submissions]);

  // ---- Submissions ----

  const getSubmissionByStudentAndProject = useCallback((studentId: string, projectId: string) => {
    return submissions.find(s => s.student_id === studentId && s.project_id === projectId);
  }, [submissions]);

  const getSubmissionsByProject = useCallback((projectId: string) => {
    return submissions.filter(s => s.project_id === projectId);
  }, [submissions]);

  const getSubmissionsByStudent = useCallback((studentId: string) => {
    return submissions.filter(s => s.student_id === studentId);
  }, [submissions]);

  const createSubmission = useCallback((input: CreateSubmissionInput): ProjectSubmission => {
    // Check for existing submission (prevent duplicates)
    const existing = submissions.find(s => s.student_id === input.student_id && s.project_id === input.project_id);
    if (existing) {
      // Update existing submission
      const updated = {
        ...existing,
        submission_text: input.submission_text || existing.submission_text,
        submission_url: input.submission_url || existing.submission_url,
        storage_path: input.storage_path || existing.storage_path,
        status: 'submitted' as const,
        updated_at: new Date().toISOString(),
      };
      setSubmissions(prev => prev.map(s => s.id === existing.id ? updated : s));
      return updated;
    }

    const newSubmission: ProjectSubmission = {
      id: `sub-${Date.now()}`,
      project_id: input.project_id,
      student_id: input.student_id,
      submission_text: input.submission_text || '',
      submission_url: input.submission_url || '',
      storage_path: input.storage_path || null,
      status: 'submitted',
      feedback: null,
      reviewed_by: null,
      reviewed_at: null,
      created_at: new Date().toISOString(),
    };
    setSubmissions(prev => [...prev, newSubmission]);
    return newSubmission;
  }, [submissions]);

  const updateSubmission = useCallback((id: string, updates: Partial<ProjectSubmission>) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const submitFeedback = useCallback((feedback: SubmissionFeedback) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === feedback.submission_id) {
        return {
          ...s,
          feedback: feedback.feedback,
          status: feedback.status,
          reviewed_by: feedback.reviewed_by,
          reviewed_at: new Date().toISOString(),
        };
      }
      return s;
    }));
  }, []);

  // ---- Stats ----

  const getSubmissionCount = useCallback((projectId: string) => {
    return submissions.filter(s => s.project_id === projectId).length;
  }, [submissions]);

  const getPendingReviewCount = useCallback(() => {
    return submissions.filter(s => s.status === 'submitted').length;
  }, [submissions]);

  return (
    <SubmissionsContext.Provider value={{
      projects,
      getProject,
      getProjectsByCohort,
      createProject,
      updateProject,
      deleteProject,
      submissions,
      getSubmissionByStudentAndProject,
      getSubmissionsByProject,
      getSubmissionsByStudent,
      createSubmission,
      updateSubmission,
      submitFeedback,
      getSubmissionCount,
      getPendingReviewCount,
    }}>
      {children}
    </SubmissionsContext.Provider>
  );
}

export function useSubmissions() {
  const context = useContext(SubmissionsContext);
  if (!context) {
    throw new Error('useSubmissions must be used within a SubmissionsProvider');
  }
  return context;
}
