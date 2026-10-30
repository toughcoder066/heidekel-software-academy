import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CreditCard, Calendar, BookOpen, FolderKanban, Bell, TrendingUp, CheckCircle2, Clock, AlertCircle, Search, Filter, Eye, Edit, Plus } from 'lucide-react';
import { COURSES, COHORTS, ENROLLMENTS, ORDERS, PAYMENTS, USERS, PROJECTS, ANNOUNCEMENTS, formatCurrency, formatDate, formatDateTime } from '../store';

// ============ ADMIN DASHBOARD ============

export function AdminDashboard() {
  const totalStudents = USERS.filter(u => u.role === 'student').length;
  const activeEnrollments = ENROLLMENTS.filter(e => e.status === 'active').length;
  const successfulPayments = PAYMENTS.filter(p => p.status === 'success').length;
  const pendingPayments = PAYMENTS.filter(p => p.status === 'pending').length;
  const activeCohorts = COHORTS.filter(c => c.status === 'active' || c.status === 'upcoming').length;
  const pendingSubmissions = PROJECTS.filter(p => p.status === 'active').length;

  const stats = [
    { label: 'Total Students', value: totalStudents, icon: Users, color: 'bg-blue-light text-navy' },
    { label: 'Active Enrollments', value: activeEnrollments, icon: CheckCircle2, color: 'bg-success-light text-success' },
    { label: 'Successful Payments', value: successfulPayments, icon: CreditCard, color: 'bg-blue-light text-navy' },
    { label: 'Active Cohorts', value: activeCohorts, icon: Calendar, color: 'bg-warning-light text-warning' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Admin Dashboard</h1>
        <p className="text-sm text-text-secondary mt-1">Overview of your academy operations.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-border rounded-xl p-5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-text-main">{stat.value}</p>
            <p className="text-xs text-text-secondary mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent enrollments */}
        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-main">Recent enrollments</h2>
            <Link to="/admin/enrollments" className="text-xs font-medium text-navy hover:text-navy-deep">View all</Link>
          </div>
          <div className="space-y-3">
            {ENROLLMENTS.slice(0, 5).map(enrollment => {
              const student = USERS.find(u => u.id === enrollment.student_id);
              const cohort = COHORTS.find(c => c.id === enrollment.cohort_id);
              return (
                <div key={enrollment.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text-main">{student?.full_name}</p>
                    <p className="text-xs text-text-secondary">{cohort?.name}</p>
                  </div>
                  <span className="text-xs text-text-secondary">{formatDate(enrollment.enrolled_at)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming classes */}
        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-main">Upcoming classes</h2>
            <Link to="/admin/cohorts" className="text-xs font-medium text-navy hover:text-navy-deep">View all</Link>
          </div>
          <div className="space-y-3">
            {COHORTS.filter(c => c.status === 'active' || c.status === 'upcoming').flatMap(cohort =>
              cohort.sessions.filter(s => new Date(s.starts_at) > new Date()).slice(0, 2).map(session => (
                <div key={session.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text-main">{session.title}</p>
                    <p className="text-xs text-text-secondary">{cohort.name}</p>
                  </div>
                  <span className="text-xs text-text-secondary">{formatDateTime(session.starts_at)}</span>
                </div>
              ))
            ).slice(0, 5)}
          </div>
        </div>

        {/* Payment summary */}
        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-main">Payment summary</h2>
            <Link to="/admin/payments" className="text-xs font-medium text-navy hover:text-navy-deep">View all</Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-text-secondary">Total revenue</span>
              <span className="text-sm font-semibold text-text-main">
                {formatCurrency(PAYMENTS.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0))}
              </span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-text-secondary">Successful transactions</span>
              <span className="text-sm font-medium text-success">{successfulPayments}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-text-secondary">Pending transactions</span>
              <span className="text-sm font-medium text-warning">{pendingPayments}</span>
            </div>
          </div>
        </div>

        {/* Projects awaiting review */}
        <div className="bg-white border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-main">Projects</h2>
            <Link to="/admin/projects" className="text-xs font-medium text-navy hover:text-navy-deep">View all</Link>
          </div>
          <div className="space-y-3">
            {PROJECTS.map(project => {
              const cohort = COHORTS.find(c => c.id === project.cohort_id);
              return (
                <div key={project.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text-main">{project.title}</p>
                    <p className="text-xs text-text-secondary">{cohort?.name}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    project.status === 'active' ? 'bg-success-light text-success' : 'bg-bg-light text-text-secondary'
                  }`}>
                    {project.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ ADMIN COURSES ============

export function AdminCourses() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Courses</h1>
          <p className="text-sm text-text-secondary mt-1">Manage your course catalogue.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors">
          <Plus className="w-4 h-4" />
          New Course
        </button>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-light">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Course</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden sm:table-cell">Price</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">Modules</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {COURSES.map(course => (
                <tr key={course.id} className="border-b border-border last:border-0 hover:bg-bg-light transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-text-main">{course.title}</p>
                      <p className="text-xs text-text-secondary mt-0.5">/{course.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm text-text-main">{formatCurrency(course.price_amount)}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-sm text-text-secondary">{course.curriculum.length} modules</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                      course.published_at ? 'bg-success-light text-success' : 'bg-bg-light text-text-secondary'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${course.published_at ? 'bg-success' : 'bg-text-secondary'}`} />
                      {course.published_at ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 text-text-secondary hover:text-navy transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
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

// ============ ADMIN ENROLLMENTS ============

export function AdminEnrollments() {
  const [search, setSearch] = useState('');

  const filteredEnrollments = ENROLLMENTS.filter(e => {
    const student = USERS.find(u => u.id === e.student_id);
    return student?.full_name.toLowerCase().includes(search.toLowerCase()) ||
           student?.email.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Enrollments</h1>
        <p className="text-sm text-text-secondary mt-1">View and manage student enrollments.</p>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
        />
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-light">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Student</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden sm:table-cell">Cohort</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">Enrolled</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map(enrollment => {
                const student = USERS.find(u => u.id === enrollment.student_id);
                const cohort = COHORTS.find(c => c.id === enrollment.cohort_id);
                return (
                  <tr key={enrollment.id} className="border-b border-border last:border-0 hover:bg-bg-light transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-text-main">{student?.full_name}</p>
                        <p className="text-xs text-text-secondary">{student?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-text-secondary">{cohort?.name}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-text-secondary">{formatDate(enrollment.enrolled_at)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                        enrollment.status === 'active' ? 'bg-success-light text-success' : 'bg-bg-light text-text-secondary'
                      }`}>
                        {enrollment.status.charAt(0).toUpperCase() + enrollment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredEnrollments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-text-secondary">No enrollments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ ADMIN PAYMENTS ============

export function AdminPayments() {
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPayments = PAYMENTS.filter(p => {
    if (statusFilter === 'all') return true;
    return p.status === statusFilter;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-main">Payments</h1>
        <p className="text-sm text-text-secondary mt-1">View payment transactions and status.</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-text-secondary" />
        {['all', 'success', 'pending', 'failed'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              statusFilter === status ? 'bg-navy text-white' : 'bg-white border border-border text-text-secondary hover:text-navy'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-light">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Reference</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden sm:table-cell">Order</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => {
                const order = ORDERS.find(o => o.id === payment.order_id);
                const student = order ? USERS.find(u => u.id === order.student_id) : null;
                return (
                  <tr key={payment.id} className="border-b border-border last:border-0 hover:bg-bg-light transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-mono font-medium text-text-main">{payment.provider_reference}</p>
                        <p className="text-xs text-text-secondary">{student?.full_name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm font-mono text-text-secondary">{payment.order_id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-text-main">{formatCurrency(payment.amount)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                        payment.status === 'success' ? 'bg-success-light text-success' :
                        payment.status === 'pending' ? 'bg-warning-light text-warning' :
                        'bg-error-light text-error'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          payment.status === 'success' ? 'bg-success' :
                          payment.status === 'pending' ? 'bg-warning' :
                          'bg-error'
                        }`} />
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-text-secondary">{formatDate(payment.created_at)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-text-secondary">No payments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ ADMIN PROJECTS ============

export function AdminProjects() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Projects</h1>
          <p className="text-sm text-text-secondary mt-1">Review student submissions and provide feedback.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="space-y-4">
        {PROJECTS.map(project => {
          const cohort = COHORTS.find(c => c.id === project.cohort_id);
          return (
            <div key={project.id} className="bg-white border border-border rounded-xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-base font-semibold text-text-main">{project.title}</h3>
                  <p className="text-sm text-text-secondary mt-0.5">{cohort?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    project.status === 'active' ? 'bg-success-light text-success' : 'bg-bg-light text-text-secondary'
                  }`}>
                    {project.status}
                  </span>
                  <button className="p-1.5 text-text-secondary hover:text-navy transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-text-secondary mb-3">{project.description}</p>
              <div className="flex items-center gap-4 text-xs text-text-secondary">
                <span>Due: {formatDate(project.due_at)}</span>
                <span>•</span>
                <span>0 submissions</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ ADMIN ANNOUNCEMENTS ============

export function AdminAnnouncements() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Announcements</h1>
          <p className="text-sm text-text-secondary mt-1">Create and manage course announcements.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors">
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {ANNOUNCEMENTS.map(ann => {
          const cohort = ann.cohort_id ? COHORTS.find(c => c.id === ann.cohort_id) : null;
          return (
            <div key={ann.id} className="bg-white border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-text-main">{ann.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-text-secondary">{formatDate(ann.published_at)}</span>
                    {cohort && (
                      <span className="text-xs px-2 py-0.5 bg-blue-light text-navy rounded font-medium">
                        {cohort.name}
                      </span>
                    )}
                    {!ann.cohort_id && (
                      <span className="text-xs px-2 py-0.5 bg-bg-light text-text-secondary rounded font-medium">
                        All students
                      </span>
                    )}
                  </div>
                </div>
                <button className="p-1.5 text-text-secondary hover:text-navy transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{ann.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
