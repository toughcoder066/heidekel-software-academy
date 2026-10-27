import { createContext, useContext } from 'react';

// ============ TYPES ============

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: 'student' | 'admin';
  created_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  cover_image_path: string;
  price_amount: number; // in minor units (pesewas)
  currency: string;
  prerequisites: string[];
  learning_outcomes: string[];
  certificate_requirements: string[];
  curriculum: CourseModule[];
  published_at: string | null;
  created_at: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: string[];
  duration: string;
}

export interface Cohort {
  id: string;
  course_id: string;
  name: string;
  start_date: string;
  end_date: string;
  enrollment_deadline: string;
  capacity: number;
  enrolled_count: number;
  status: 'draft' | 'upcoming' | 'active' | 'completed' | 'cancelled';
  sessions: Session[];
  created_at: string;
}

export interface Session {
  id: string;
  cohort_id: string;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string;
  meeting_url: string | null;
  resource_path: string | null;
}

export interface Order {
  id: string;
  student_id: string;
  cohort_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  provider: string;
  provider_reference: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  paid_at: string | null;
  created_at: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  cohort_id: string;
  order_id: string;
  status: 'active' | 'completed' | 'cancelled';
  enrolled_at: string;
}

export interface Project {
  id: string;
  cohort_id: string;
  title: string;
  description: string;
  instructions: string;
  due_at: string;
  status: 'active' | 'closed' | 'archived';
}

export interface ProjectSubmission {
  id: string;
  project_id: string;
  student_id: string;
  submission_text: string;
  submission_url: string;
  storage_path: string | null;
  status: 'not_started' | 'in_progress' | 'submitted' | 'changes_requested' | 'reviewed';
  feedback: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface Announcement {
  id: string;
  author_id: string;
  cohort_id: string | null;
  title: string;
  body: string;
  published_at: string;
  created_at: string;
}

// ============ MOCK DATA ============

export const COURSES: Course[] = [
  {
    id: 'course-ai-students',
    slug: 'ai-for-students',
    title: 'AI for Students: Practical Workflows',
    short_description: 'Learn to combine AI tools into practical workflows for studying, research, productivity, and projects.',
    description: `This hands-on course teaches university students how to use AI tools effectively — not just as chatbots, but as integrated components of real workflows. You'll learn prompt engineering, tool selection, automation, and how to build reusable AI pipelines that help you study smarter, research faster, and deliver better projects.

By the end of this course, you won't just understand AI — you'll have built your own set of practical AI workflows that you can use throughout your academic career and beyond.`,
    cover_image_path: '/images/ai-course-cover.jpg',
    price_amount: 35000, // GHS 350.00
    currency: 'GHS',
    prerequisites: [
      'Basic computer literacy',
      'A laptop or desktop computer with internet access',
      'A Gmail or Microsoft account for accessing AI tools',
      'Willingness to learn and experiment'
    ],
    learning_outcomes: [
      'Build effective prompts for studying, research, and writing',
      'Combine multiple AI tools into integrated workflows',
      'Create custom AI assistants for specific tasks',
      'Automate repetitive academic tasks',
      'Develop reusable prompt templates and pipelines',
      'Evaluate AI outputs critically and improve iteratively',
      'Apply AI tools to real academic projects and research'
    ],
    certificate_requirements: [
      'Attend at least 80% of live sessions',
      'Complete all assigned projects',
      'Submit final capstone project',
      'Receive passing grade on project review'
    ],
    curriculum: [
      {
        id: 'mod-1',
        title: 'Foundations of AI Tools',
        description: 'Understanding the AI landscape and setting up your toolkit',
        lessons: ['Introduction to AI tools and capabilities', 'Setting up ChatGPT, Claude, Gemini, and Copilot', 'Understanding prompts, context, and limitations', 'AI ethics and academic integrity'],
        duration: '2 sessions'
      },
      {
        id: 'mod-2',
        title: 'Prompt Engineering for Students',
        description: 'Master the art of communicating with AI effectively',
        lessons: ['Prompt structure and best practices', 'Chain-of-thought and few-shot prompting', 'Role-based and system prompts', 'Iterative refinement techniques'],
        duration: '2 sessions'
      },
      {
        id: 'mod-3',
        title: 'AI-Powered Study Workflows',
        description: 'Transform how you learn, study, and retain information',
        lessons: ['AI-assisted note-taking and summarization', 'Concept explanation and Socratic learning', 'Creating study materials with AI', 'Building spaced repetition systems'],
        duration: '2 sessions'
      },
      {
        id: 'mod-4',
        title: 'Research and Writing with AI',
        description: 'Accelerate your research process and improve writing quality',
        lessons: ['Literature search and synthesis', 'Research outline generation', 'Academic writing assistance', 'Citation management and verification'],
        duration: '2 sessions'
      },
      {
        id: 'mod-5',
        title: 'Project Management and Productivity',
        description: 'Use AI to organize, plan, and execute projects efficiently',
        lessons: ['AI-assisted project planning', 'Task breakdown and scheduling', 'Meeting notes and action items', 'Email and communication drafting'],
        duration: '2 sessions'
      },
      {
        id: 'mod-6',
        title: 'Building AI Automations',
        description: 'Create reusable workflows and simple automations',
        lessons: ['Introduction to automation concepts', 'Building with no-code tools', 'Creating custom GPTs and assistants', 'Connecting tools with APIs and webhooks'],
        duration: '2 sessions'
      },
      {
        id: 'mod-7',
        title: 'Capstone Project',
        description: 'Apply everything you\'ve learned to a real-world project',
        lessons: ['Project scoping and planning', 'Implementation and iteration', 'Documentation and presentation', 'Peer review and feedback'],
        duration: '2 sessions'
      }
    ],
    published_at: '2025-01-15T00:00:00Z',
    created_at: '2025-01-10T00:00:00Z'
  }
];

export const COHORTS: Cohort[] = [
  {
    id: 'cohort-1',
    course_id: 'course-ai-students',
    name: 'Cohort 1 — January 2026',
    start_date: '2026-01-20',
    end_date: '2026-03-10',
    enrollment_deadline: '2026-01-18',
    capacity: 50,
    enrolled_count: 34,
    status: 'active',
    sessions: [
      { id: 's1-1', cohort_id: 'cohort-1', title: 'Welcome & AI Foundations', description: 'Introduction to the course, AI landscape overview, and tool setup', starts_at: '2026-01-20T17:00:00+00:00', ends_at: '2026-01-20T19:00:00+00:00', meeting_url: 'https://meet.google.com/ai-course-session-1', resource_path: null },
      { id: 's1-2', cohort_id: 'cohort-1', title: 'AI Tools Deep Dive', description: 'Hands-on setup and exploration of ChatGPT, Claude, Gemini, and Copilot', starts_at: '2026-01-22T17:00:00+00:00', ends_at: '2026-01-22T19:00:00+00:00', meeting_url: 'https://meet.google.com/ai-course-session-2', resource_path: null },
      { id: 's1-3', cohort_id: 'cohort-1', title: 'Prompt Engineering Fundamentals', description: 'Structure, best practices, and common patterns', starts_at: '2026-01-27T17:00:00+00:00', ends_at: '2026-01-27T19:00:00+00:00', meeting_url: 'https://meet.google.com/ai-course-session-3', resource_path: null },
      { id: 's1-4', cohort_id: 'cohort-1', title: 'Advanced Prompting Techniques', description: 'Chain-of-thought, few-shot, and iterative refinement', starts_at: '2026-01-29T17:00:00+00:00', ends_at: '2026-01-29T19:00:00+00:00', meeting_url: 'https://meet.google.com/ai-course-session-4', resource_path: null },
      { id: 's1-5', cohort_id: 'cohort-1', title: 'AI-Powered Study Systems', description: 'Building effective study workflows with AI', starts_at: '2026-02-03T17:00:00+00:00', ends_at: '2026-02-03T19:00:00+00:00', meeting_url: 'https://meet.google.com/ai-course-session-5', resource_path: null },
      { id: 's1-6', cohort_id: 'cohort-1', title: 'Research & Writing Workflows', description: 'Accelerating research and improving writing with AI', starts_at: '2026-02-05T17:00:00+00:00', ends_at: '2026-02-05T19:00:00+00:00', meeting_url: 'https://meet.google.com/ai-course-session-6', resource_path: null },
      { id: 's1-7', cohort_id: 'cohort-1', title: 'Project Management with AI', description: 'Planning, organizing, and executing projects efficiently', starts_at: '2026-02-10T17:00:00+00:00', ends_at: '2026-02-10T19:00:00+00:00', meeting_url: 'https://meet.google.com/ai-course-session-7', resource_path: null },
      { id: 's1-8', cohort_id: 'cohort-1', title: 'Building Automations', description: 'Creating reusable workflows and no-code automations', starts_at: '2026-02-12T17:00:00+00:00', ends_at: '2026-02-12T19:00:00+00:00', meeting_url: 'https://meet.google.com/ai-course-session-8', resource_path: null },
      { id: 's1-9', cohort_id: 'cohort-1', title: 'Custom AI Assistants', description: 'Building custom GPTs and task-specific assistants', starts_at: '2026-02-17T17:00:00+00:00', ends_at: '2026-02-17T19:00:00+00:00', meeting_url: 'https://meet.google.com/ai-course-session-9', resource_path: null },
      { id: 's1-10', cohort_id: 'cohort-1', title: 'Capstone Project Workshop', description: 'Guided work session for capstone projects', starts_at: '2026-02-19T17:00:00+00:00', ends_at: '2026-02-19T19:00:00+00:00', meeting_url: 'https://meet.google.com/ai-course-session-10', resource_path: null },
      { id: 's1-11', cohort_id: 'cohort-1', title: 'Project Presentations', description: 'Students present their capstone projects', starts_at: '2026-02-24T17:00:00+00:00', ends_at: '2026-02-24T19:00:00+00:00', meeting_url: 'https://meet.google.com/ai-course-session-11', resource_path: null },
      { id: 's1-12', cohort_id: 'cohort-1', title: 'Course Wrap-Up & Next Steps', description: 'Review, feedback, and continued learning paths', starts_at: '2026-02-26T17:00:00+00:00', ends_at: '2026-02-26T19:00:00+00:00', meeting_url: 'https://meet.google.com/ai-course-session-12', resource_path: null },
    ],
    created_at: '2025-12-01T00:00:00Z'
  },
  {
    id: 'cohort-2',
    course_id: 'course-ai-students',
    name: 'Cohort 2 — April 2026',
    start_date: '2026-04-14',
    end_date: '2026-06-02',
    enrollment_deadline: '2026-04-12',
    capacity: 60,
    enrolled_count: 12,
    status: 'upcoming',
    sessions: [],
    created_at: '2026-01-15T00:00:00Z'
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'proj-1',
    cohort_id: 'cohort-1',
    title: 'Personal Study Assistant',
    description: 'Build a custom AI-powered study assistant that helps you understand difficult concepts, create flashcards, and generate practice questions.',
    instructions: '1. Choose a subject area you find challenging\n2. Design a prompt system that explains concepts in multiple ways\n3. Create a workflow that generates study materials\n4. Document your process and results\n5. Submit your prompt templates and a brief report',
    due_at: '2026-02-08T23:59:00+00:00',
    status: 'active'
  },
  {
    id: 'proj-2',
    cohort_id: 'cohort-1',
    title: 'Research Workflow Pipeline',
    description: 'Create an end-to-end research workflow using AI tools — from topic exploration to literature synthesis to outline generation.',
    instructions: '1. Select a research topic\n2. Use AI tools to explore the topic and identify key sources\n3. Build a workflow that synthesizes findings\n4. Generate a structured research outline\n5. Document each step with screenshots and prompts used',
    due_at: '2026-02-15T23:59:00+00:00',
    status: 'active'
  },
  {
    id: 'proj-3',
    cohort_id: 'cohort-1',
    title: 'Capstone: AI Automation Project',
    description: 'Design and implement an AI automation that solves a real problem in your academic or personal life. This is your final project.',
    instructions: '1. Identify a repetitive or time-consuming task\n2. Design an AI-powered solution\n3. Implement it using available tools (no-code preferred)\n4. Test and iterate\n5. Present your solution with documentation',
    due_at: '2026-02-24T23:59:00+00:00',
    status: 'active'
  }
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    author_id: 'admin-1',
    cohort_id: 'cohort-1',
    title: 'Welcome to Cohort 1!',
    body: 'Welcome to the first cohort of AI for Students! We\'re excited to have you join us. Your first session is on January 20th at 5:00 PM GMT. Please make sure you have set up all the AI tools mentioned in the pre-course email. See you there!',
    published_at: '2026-01-15T10:00:00Z',
    created_at: '2026-01-15T10:00:00Z'
  },
  {
    id: 'ann-2',
    author_id: 'admin-1',
    cohort_id: 'cohort-1',
    title: 'Session 3 Recording Available',
    body: 'The recording for Session 3 (Prompt Engineering Fundamentals) is now available in the Resources section. Please review it before the next session. The slide deck has also been uploaded.',
    published_at: '2026-01-28T08:00:00Z',
    created_at: '2026-01-28T08:00:00Z'
  },
  {
    id: 'ann-3',
    author_id: 'admin-1',
    cohort_id: 'cohort-1',
    title: 'Project 1 Deadline Reminder',
    body: 'Reminder: Your Personal Study Assistant project is due on February 8th. Start early and don\'t hesitate to ask questions during office hours. Good luck!',
    published_at: '2026-02-01T09:00:00Z',
    created_at: '2026-02-01T09:00:00Z'
  }
];

export const ENROLLMENTS: Enrollment[] = [
  { id: 'enr-1', student_id: 'student-1', cohort_id: 'cohort-1', order_id: 'order-1', status: 'active', enrolled_at: '2026-01-16T14:30:00Z' },
];

export const ORDERS: Order[] = [
  { id: 'order-1', student_id: 'student-1', cohort_id: 'cohort-1', amount: 35000, currency: 'GHS', status: 'paid', created_at: '2026-01-16T14:00:00Z' },
];

export const PAYMENTS: Payment[] = [
  { id: 'pay-1', order_id: 'order-1', provider: 'paystack', provider_reference: 'PS-REF-001', amount: 35000, currency: 'GHS', status: 'success', paid_at: '2026-01-16T14:25:00Z', created_at: '2026-01-16T14:00:00Z' },
];

export const USERS: User[] = [
  { id: 'admin-1', email: 'admin@heidekel.com', full_name: 'Course Administrator', phone: '+233201234567', role: 'admin', created_at: '2025-01-01T00:00:00Z' },
  { id: 'student-1', email: 'student@example.com', full_name: 'Kwame Asante', phone: '+233241234567', role: 'student', created_at: '2026-01-15T10:00:00Z' },
];

// ============ AUTH CONTEXT ============

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: { full_name: string; email: string; phone: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateProfile: () => {},
});

export const useAuth = () => useContext(AuthContext);

// ============ HELPERS ============

export function formatCurrency(amount: number, currency: string = 'GHS'): string {
  const value = amount / 100;
  return `${currency} ${value.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Accra'
  });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Accra'
  });
}

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find(c => c.slug === slug);
}

export function getCohortForCourse(courseId: string): Cohort[] {
  return COHORTS.filter(c => c.course_id === courseId);
}

export function getNextCohort(courseId: string): Cohort | undefined {
  return COHORTS.find(c => c.course_id === courseId && (c.status === 'upcoming' || c.status === 'active'));
}
