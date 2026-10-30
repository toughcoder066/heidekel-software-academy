import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Calendar, Users, ChevronDown, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { COURSES, formatDate, formatDateTime, formatTime, type Cohort, type Session } from '../store';
import { useCohorts, type CohortFormData, type SessionFormData } from '../lib/cohort-context';
import { Modal } from '../components/Modal';
import { CohortForm } from '../components/CohortForm';
import { SessionForm } from '../components/SessionForm';

export function AdminCohorts() {
  const { cohorts, createCohort, updateCohort, deleteCohort, addSession, updateSession, deleteSession } = useCohorts();

  const [showCohortModal, setShowCohortModal] = useState(false);
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);
  const [expandedCohortId, setExpandedCohortId] = useState<string | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [editingSession, setEditingSession] = useState<{ cohortId: string; session: Session } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Cohort handlers
  const handleCreateCohort = (data: CohortFormData) => {
    createCohort(data);
    setShowCohortModal(false);
    showToast('Cohort created successfully');
  };

  const handleUpdateCohort = (data: CohortFormData) => {
    if (editingCohort) {
      updateCohort(editingCohort.id, data);
      setEditingCohort(null);
      setShowCohortModal(false);
      showToast('Cohort updated successfully');
    }
  };

  const handleDeleteCohort = (cohort: Cohort) => {
    if (cohort.enrolled_count > 0) {
      showToast('Cannot delete cohort with enrolled students', 'error');
      return;
    }
    if (confirm(`Delete cohort "${cohort.name}"? This cannot be undone.`)) {
      deleteCohort(cohort.id);
      showToast('Cohort deleted');
    }
  };

  const openEditCohort = (cohort: Cohort) => {
    setEditingCohort(cohort);
    setShowCohortModal(true);
  };

  // Session handlers
  const handleCreateSession = (data: SessionFormData) => {
    if (expandedCohortId) {
      addSession(expandedCohortId, data);
      setShowSessionModal(false);
      showToast('Session added');
    }
  };

  const handleUpdateSession = (data: SessionFormData) => {
    if (editingSession) {
      updateSession(editingSession.cohortId, editingSession.session.id, data);
      setEditingSession(null);
      setShowSessionModal(false);
      showToast('Session updated');
    }
  };

  const handleDeleteSession = (cohortId: string, session: Session) => {
    if (confirm(`Delete session "${session.title}"?`)) {
      deleteSession(cohortId, session.id);
      showToast('Session deleted');
    }
  };

  const openAddSession = (cohortId: string) => {
    setExpandedCohortId(cohortId);
    setEditingSession(null);
    setShowSessionModal(true);
  };

  const openEditSession = (cohortId: string, session: Session) => {
    setExpandedCohortId(cohortId);
    setEditingSession({ cohortId, session });
    setShowSessionModal(true);
  };

  const statusColors: Record<Cohort['status'], string> = {
    draft: 'bg-bg-light text-text-secondary',
    upcoming: 'bg-blue-light text-navy',
    active: 'bg-success-light text-success',
    completed: 'bg-bg-light text-text-secondary',
    cancelled: 'bg-error-light text-error',
  };

  const statusDots: Record<Cohort['status'], string> = {
    draft: 'bg-text-secondary',
    upcoming: 'bg-navy',
    active: 'bg-success',
    completed: 'bg-text-secondary',
    cancelled: 'bg-error',
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border ${
            toast.type === 'success' ? 'bg-success-light border-success/20 text-success' : 'bg-error-light border-error/20 text-error'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Cohorts</h1>
          <p className="text-sm text-text-secondary mt-1">Manage course cohorts, schedules, and enrollment settings.</p>
        </div>
        <button
          onClick={() => {
            setEditingCohort(null);
            setShowCohortModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Cohort
        </button>
      </div>

      {/* Cohorts list */}
      {cohorts.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-12 text-center">
          <Calendar className="w-10 h-10 text-text-secondary/30 mx-auto mb-3" />
          <p className="text-sm text-text-secondary mb-4">No cohorts yet. Create your first cohort to get started.</p>
          <button
            onClick={() => setShowCohortModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Cohort
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cohorts.map(cohort => {
            const course = COURSES.find(c => c.id === cohort.course_id);
            const isExpanded = expandedCohortId === cohort.id;
            const sortedSessions = [...cohort.sessions].sort((a, b) =>
              new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
            );

            return (
              <div key={cohort.id} className="bg-white border border-border rounded-xl overflow-hidden">
                {/* Cohort header */}
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-base font-semibold text-text-main">{cohort.name}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[cohort.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDots[cohort.status]}`} />
                          {cohort.status.charAt(0).toUpperCase() + cohort.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary">{course?.title}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEditCohort(cohort)}
                        className="p-1.5 text-text-secondary hover:text-navy hover:bg-blue-light rounded-lg transition-colors"
                        title="Edit cohort"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCohort(cohort)}
                        disabled={cohort.enrolled_count > 0}
                        className="p-1.5 text-text-secondary hover:text-error hover:bg-error-light rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title={cohort.enrolled_count > 0 ? 'Cannot delete: has enrolled students' : 'Delete cohort'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                    <div>
                      <p className="text-text-secondary">Start</p>
                      <p className="font-medium text-text-main">{formatDate(cohort.start_date)}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">End</p>
                      <p className="font-medium text-text-main">{formatDate(cohort.end_date)}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Enrollment Deadline</p>
                      <p className="font-medium text-text-main">{formatDate(cohort.enrollment_deadline)}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary">Enrolled</p>
                      <p className="font-medium text-text-main">
                        {cohort.enrolled_count} / {cohort.capacity}
                        <span className="text-text-secondary font-normal ml-1">
                          ({cohort.capacity - cohort.enrolled_count} spots left)
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Sessions toggle */}
                  <button
                    onClick={() => setExpandedCohortId(isExpanded ? null : cohort.id)}
                    className="flex items-center gap-2 text-sm font-medium text-navy hover:text-navy-deep transition-colors"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    {cohort.sessions.length} session{cohort.sessions.length !== 1 ? 's' : ''} scheduled
                  </button>
                </div>

                {/* Sessions panel */}
                {isExpanded && (
                  <div className="border-t border-border bg-bg-light p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-text-main">Class sessions</h4>
                      <button
                        onClick={() => openAddSession(cohort.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        Add Session
                      </button>
                    </div>

                    {sortedSessions.length === 0 ? (
                      <div className="text-center py-6 bg-white border border-border rounded-lg">
                        <Calendar className="w-8 h-8 text-text-secondary/30 mx-auto mb-2" />
                        <p className="text-sm text-text-secondary mb-3">No sessions scheduled yet.</p>
                        <button
                          onClick={() => openAddSession(cohort.id)}
                          className="text-xs font-medium text-navy hover:text-navy-deep"
                        >
                          + Add your first session
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {sortedSessions.map(session => (
                          <div key={session.id} className="bg-white border border-border rounded-lg p-3 flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text-main">{session.title}</p>
                              {session.description && (
                                <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">{session.description}</p>
                              )}
                              <div className="flex items-center gap-3 mt-1.5 text-xs text-text-secondary">
                                <span>{formatDateTime(session.starts_at)}</span>
                                <span>→</span>
                                <span>{formatTime(session.ends_at)}</span>
                                {session.meeting_url && (
                                  <span className="text-navy">🔗 Meeting link set</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                                onClick={() => openEditSession(cohort.id, session)}
                                className="p-1.5 text-text-secondary hover:text-navy hover:bg-blue-light rounded transition-colors"
                                title="Edit session"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteSession(cohort.id, session)}
                                className="p-1.5 text-text-secondary hover:text-error hover:bg-error-light rounded transition-colors"
                                title="Delete session"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Cohort Modal */}
      <Modal
        open={showCohortModal}
        onClose={() => {
          setShowCohortModal(false);
          setEditingCohort(null);
        }}
        title={editingCohort ? 'Edit Cohort' : 'Create New Cohort'}
        size="lg"
      >
        <CohortForm
          initialData={editingCohort || undefined}
          isEditing={!!editingCohort}
          onSubmit={editingCohort ? handleUpdateCohort : handleCreateCohort}
          onCancel={() => {
            setShowCohortModal(false);
            setEditingCohort(null);
          }}
        />
      </Modal>

      {/* Session Modal */}
      <Modal
        open={showSessionModal}
        onClose={() => {
          setShowSessionModal(false);
          setEditingSession(null);
        }}
        title={editingSession ? 'Edit Session' : 'Add New Session'}
      >
        <SessionForm
          initialData={editingSession?.session}
          isEditing={!!editingSession}
          onSubmit={editingSession ? handleUpdateSession : handleCreateSession}
          onCancel={() => {
            setShowSessionModal(false);
            setEditingSession(null);
          }}
        />
      </Modal>
    </div>
  );
}
