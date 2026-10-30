import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, BookOpen, FolderKanban, Bell, ExternalLink, CheckCircle2, AlertCircle, FileText, Upload, ArrowRight } from 'lucide-react';
import { useAuth, COHORTS, COURSES, ANNOUNCEMENTS, formatDateTime, formatDate, formatTime } from '../store';
import { useCohorts } from '../lib/cohort-context';
import { useEnrollments } from '../lib/enrollment-context';
import { useSubmissions } from '../lib/submissions-context';

// ============ STUDENT DASHBOARD ============

export function StudentDashboard() {
  const { user } = useAuth();
  const { getStudentEnrollments } = useEnrollments();
  const { cohorts } = useCohorts();
  const { getProjectsByCohort } = useSubmissions();

  const studentEnrollments = getStudentEnrollments(user!.id);
  const enrollment = studentEnrollments[0];
  const cohort = enrollment ? cohorts.find(c => c.id === enrollment.cohort_id) : undefined;
  const course = cohort ? COURSES.find(c => c.id === cohort.course_id) : null;

  // Get next session
  const now = new Date();
  const upcomingSessions = cohort?.sessions.filter(s => new Date(s.starts_at) > now) || [];
  const nextSession = upcomingSessions[0];

  // Get student's projects
  const cohortProjects = cohort ? getProjectsByCohort(cohort.id) : [];

  // Get announcements
  const announcements = ANNOUNCEMENTS.filter(a => !a.cohort_id || a.cohort_id === cohort?.id)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 3);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Welcome back, {user?.full_name?.split(' ')[0]}</h1>
        <p className="text-sm text-text-secondary mt-1">Here's what's happening in your course.</p>
      </div>

      {/* Course info card */}
      {course && cohort && (
        <div className="bg-white border border-border rounded-xl p-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">Current course</p>
              <h2 className="text-base font-semibold text-text-main mt-1">{course.title}</h2>
              <p className="text-sm text-text-secondary">{cohort.name}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full self-start ${
              enrollment?.status === 'active' ? 'bg-success-light text-success' : 'bg-bg-light text-text-secondary'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${enrollment?.status === 'active' ? 'bg-success' : 'bg-text-secondary'}`} />
              {enrollment?.status === 'active' ? 'Active' : 'Enrolled'}
            </span>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Next session */}
        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-navy" />
            <h3 className="text-sm font-semibold text-text-main">Next session</h3>
          </div>
          {nextSession ? (
            <div>
              <p className="text-sm font-medium text-text-main">{nextSession.title}</p>
              <p className="text-xs text-text-secondary mt-1">{formatDateTime(nextSession.starts_at)}</p>
              {nextSession.meeting_url && (
                <a
                  href={nextSession.meeting_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-navy hover:text-navy-deep"
                >
                  <ExternalLink className="w-3 h-3" />
                  Join meeting
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm text-text-secondary">No upcoming sessions scheduled.</p>
          )}
        </div>

        {/* Upcoming deadlines */}
        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-navy" />
            <h3 className="text-sm font-semibold text-text-main">Upcoming deadlines</h3>
          </div>
          {cohortProjects.filter(p => new Date(p.due_at) > now).length > 0 ? (
            <ul className="space-y-2">
              {cohortProjects.filter(p => new Date(p.due_at) > now).map(project => (
                <li key={project.id} className="flex items-start justify-between gap-2">
                  <span className="text-sm text-text-main">{project.title}</span>
                  <span className="text-xs text-text-secondary whitespace-nowrap">{formatDate(project.due_at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-secondary">No upcoming deadlines.</p>
          )}
        </div>

        {/* Latest announcements */}
        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-navy" />
            <h3 className="text-sm font-semibold text-text-main">Latest announcements</h3>
          </div>
          {announcements.length > 0 ? (
            <ul className="space-y-2">
              {announcements.map(ann => (
                <li key={ann.id}>
                  <p className="text-sm font-medium text-text-main">{ann.title}</p>
                  <p className="text-xs text-text-secondary">{formatDate(ann.published_at)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-secondary">No announcements yet.</p>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/student/cohort" className="flex items-center gap-2 p-3 bg-white border border-border rounded-lg hover:border-navy/20 hover:shadow-sm transition-all">
          <Calendar className="w-4 h-4 text-navy" />
          <span className="text-sm font-medium text-text-main">My Cohort</span>
        </Link>
        <Link to="/student/projects" className="flex items-center gap-2 p-3 bg-white border border-border rounded-lg hover:border-navy/20 hover:shadow-sm transition-all">
          <FolderKanban className="w-4 h-4 text-navy" />
          <span className="text-sm font-medium text-text-main">Projects</span>
        </Link>
        <Link to="/student/resources" className="flex items-center gap-2 p-3 bg-white border border-border rounded-lg hover:border-navy/20 hover:shadow-sm transition-all">
          <BookOpen className="w-4 h-4 text-navy" />
          <span className="text-sm font-medium text-text-main">Resources</span>
        </Link>
        <Link to="/student/announcements" className="flex items-center gap-2 p-3 bg-white border border-border rounded-lg hover:border-navy/20 hover:shadow-sm transition-all">
          <Bell className="w-4 h-4 text-navy" />
          <span className="text-sm font-medium text-text-main">All Announcements</span>
        </Link>
      </div>
    </div>
  );
}

// ============ STUDENT COHORT ============

export function StudentCohort() {
  const { user } = useAuth();
  const { getStudentEnrollments } = useEnrollments();
  const { cohorts } = useCohorts();
  
  const studentEnrollments = getStudentEnrollments(user!.id);
  const enrollment = studentEnrollments[0];
  const cohort = enrollment ? cohorts.find(c => c.id === enrollment.cohort_id) : undefined;
  const course = cohort ? COURSES.find(c => c.id === cohort.course_id) : null;

  if (!cohort || !course) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">No cohort information available.</p>
      </div>
    );
  }

  const now = new Date();
  const pastSessions = cohort.sessions.filter(s => new Date(s.ends_at) < now);
  const upcomingSessions = cohort.sessions.filter(s => new Date(s.starts_at) > now);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">My Cohort</h1>
        <p className="text-sm text-text-secondary mt-1">{cohort.name} · {course.title}</p>
      </div>

      {/* Cohort overview */}
      <div className="bg-white border border-border rounded-xl p-5 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-text-secondary">Start date</p>
            <p className="text-sm font-medium text-text-main">{formatDate(cohort.start_date)}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">End date</p>
            <p className="text-sm font-medium text-text-main">{formatDate(cohort.end_date)}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Total sessions</p>
            <p className="text-sm font-medium text-text-main">{cohort.sessions.length}</p>
          </div>
          <div>
            <p className="text-xs text-text-secondary">Status</p>
            <span className={`inline-flex items-center gap-1 text-xs font-medium ${
              cohort.status === 'active' ? 'text-success' : 'text-navy'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cohort.status === 'active' ? 'bg-success' : 'bg-navy'}`} />
              {cohort.status.charAt(0).toUpperCase() + cohort.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming sessions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-text-main mb-4">Upcoming sessions</h2>
        {upcomingSessions.length > 0 ? (
          <div className="space-y-3">
            {upcomingSessions.map(session => (
              <div key={session.id} className="bg-white border border-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-text-main">{session.title}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{session.description}</p>
                  <p className="text-xs text-text-secondary mt-1">{formatDateTime(session.starts_at)} — {formatTime(session.ends_at)}</p>
                </div>
                {session.meeting_url && (
                  <a
                    href={session.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Join
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">No upcoming sessions.</p>
        )}
      </div>

      {/* Past sessions */}
      <div>
        <h2 className="text-lg font-semibold text-text-main mb-4">Past sessions</h2>
        {pastSessions.length > 0 ? (
          <div className="space-y-3">
            {pastSessions.map(session => (
              <div key={session.id} className="bg-bg-light border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-text-main">{session.title}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{session.description}</p>
                    <p className="text-xs text-text-secondary mt-1">{formatDateTime(session.starts_at)}</p>
                  </div>
                  <span className="text-xs text-text-secondary whitespace-nowrap">Completed</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-secondary">No past sessions yet.</p>
        )}
      </div>
    </div>
  );
}

// ============ STUDENT PROJECTS ============

export function StudentProjects() {
  const { user } = useAuth();
  const { getStudentEnrollments } = useEnrollments();
  const { cohorts } = useCohorts();
  const { getProjectsByCohort, getSubmissionByStudentAndProject, createSubmission } = useSubmissions();
  
  const studentEnrollments = getStudentEnrollments(user!.id);
  const enrollment = studentEnrollments[0];
  const cohort = enrollment ? cohorts.find(c => c.id === enrollment.cohort_id) : undefined;
  const cohortProjects = cohort ? getProjectsByCohort(cohort.id) : [];

  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');

  const handleSubmit = (projectId: string) => {
    createSubmission({
      project_id: projectId,
      student_id: user!.id,
      submission_text: submissionText,
      submission_url: submissionUrl,
    });
    setSubmissionText('');
    setSubmissionUrl('');
    setSelectedProject(null);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Projects</h1>
        <p className="text-sm text-text-secondary mt-1">Complete your assigned projects and submit your work.</p>
      </div>

      <div className="space-y-4">
        {cohortProjects.map(project => {
          const submission = getSubmissionByStudentAndProject(user!.id, project.id);
          const isSubmitted = !!submission;
          const isExpanded = selectedProject === project.id;
          const dueDate = new Date(project.due_at);
          const isOverdue = dueDate < new Date();

          return (
            <div key={project.id} className="bg-white border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setSelectedProject(isExpanded ? null : project.id)}
                className="w-full p-5 flex items-start justify-between gap-4 text-left hover:bg-bg-light transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-text-main">{project.title}</h3>
                    {isSubmitted && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-success-light text-success rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Submitted
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-1">{project.description}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs font-medium ${isOverdue ? 'text-error' : 'text-text-secondary'}`}>
                    Due {formatDate(project.due_at)}
                  </span>
                  <ArrowRight className={`w-4 h-4 text-text-secondary transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-border">
                  <div className="pt-4">
                    <h4 className="text-sm font-medium text-text-main mb-2">Instructions</h4>
                    <div className="text-sm text-text-secondary whitespace-pre-line mb-4">{project.instructions}</div>

                    {!isSubmitted ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-text-main mb-1.5">Submission text</label>
                          <textarea
                            value={submissionText}
                            onChange={(e) => setSubmissionText(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none resize-none"
                            placeholder="Describe your work, approach, and results..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-main mb-1.5">Link (optional)</label>
                          <input
                            type="url"
                            value={submissionUrl}
                            onChange={(e) => setSubmissionUrl(e.target.value)}
                            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
                            placeholder="https://..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-main mb-1.5">File upload (optional)</label>
                          <div className="border border-dashed border-border rounded-lg p-4 text-center">
                            <Upload className="w-5 h-5 text-text-secondary mx-auto mb-2" />
                            <p className="text-xs text-text-secondary">Drag and drop files or click to browse</p>
                            <p className="text-xs text-text-secondary mt-1">PDF, DOCX, ZIP up to 10MB</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSubmit(project.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Submit project
                        </button>
                      </div>
                    ) : (
                      <div className="bg-success-light border border-success/20 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-4 h-4 text-success" />
                          <span className="text-sm font-medium text-success">Submitted</span>
                        </div>
                        <p className="text-xs text-text-secondary">Your submission has been received. The instructor will review it and provide feedback.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {cohortProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderKanban className="w-10 h-10 text-text-secondary/30 mx-auto mb-3" />
            <p className="text-sm text-text-secondary">No projects assigned yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ STUDENT RESOURCES ============

export function StudentResources() {
  const resources = [
    { id: 'r1', title: 'Session 1 — AI Foundations Slides', type: 'PDF', size: '2.4 MB', date: '2026-01-20' },
    { id: 'r2', title: 'Session 2 — AI Tools Setup Guide', type: 'PDF', size: '1.8 MB', date: '2026-01-22' },
    { id: 'r3', title: 'Prompt Engineering Cheat Sheet', type: 'PDF', size: '890 KB', date: '2026-01-27' },
    { id: 'r4', title: 'Session 3 Recording', type: 'Video', size: '145 MB', date: '2026-01-27' },
    { id: 'r5', title: 'Study Workflow Templates', type: 'ZIP', size: '3.2 MB', date: '2026-02-03' },
    { id: 'r6', title: 'Research Pipeline Guide', type: 'PDF', size: '1.5 MB', date: '2026-02-05' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Resources</h1>
        <p className="text-sm text-text-secondary mt-1">Course materials, recordings, templates, and supplementary resources.</p>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-light">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Resource</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">Size</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(resource => (
                <tr key={resource.id} className="border-b border-border last:border-0 hover:bg-bg-light transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-navy flex-shrink-0" />
                      <span className="text-sm font-medium text-text-main">{resource.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs text-text-secondary">{resource.type}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-text-secondary">{resource.size}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-text-secondary">{formatDate(resource.date)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs font-medium text-navy hover:text-navy-deep">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ STUDENT ANNOUNCEMENTS ============

export function StudentAnnouncements() {
  const { user } = useAuth();
  const { getStudentEnrollments } = useEnrollments();
  const { cohorts } = useCohorts();
  
  const studentEnrollments = getStudentEnrollments(user!.id);
  const enrollment = studentEnrollments[0];
  const cohort = enrollment ? cohorts.find(c => c.id === enrollment.cohort_id) : undefined;

  const announcements = ANNOUNCEMENTS
    .filter(a => !a.cohort_id || a.cohort_id === cohort?.id)
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Announcements</h1>
        <p className="text-sm text-text-secondary mt-1">Course updates, reminders, and important information.</p>
      </div>

      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann.id} className="bg-white border border-border rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-sm font-semibold text-text-main">{ann.title}</h3>
              <span className="text-xs text-text-secondary whitespace-nowrap">{formatDate(ann.published_at)}</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">{ann.body}</p>
            {ann.cohort_id && (
              <span className="inline-block mt-3 px-2 py-0.5 text-[10px] font-medium text-navy bg-blue-light rounded">
                Cohort-specific
              </span>
            )}
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-10 h-10 text-text-secondary/30 mx-auto mb-3" />
            <p className="text-sm text-text-secondary">No announcements yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ STUDENT PROFILE ============

export function StudentProfile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Profile</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your account information.</p>
      </div>

      <div className="max-w-lg">
        <form onSubmit={handleSave} className="bg-white border border-border rounded-xl p-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-main mb-1.5">Email</label>
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-bg-light text-text-secondary cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-text-secondary">Email cannot be changed.</p>
          </div>
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-text-main mb-1.5">Full name</label>
            <input
              type="text"
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-main mb-1.5">Phone number</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
              placeholder="+233 XX XXX XXXX"
            />
          </div>

          {saved && (
            <div className="flex items-center gap-2 p-3 bg-success-light border border-success/20 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-sm text-success">Profile updated successfully.</span>
            </div>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors"
          >
            Save changes
          </button>
        </form>
      </div>
    </div>
  );
}
