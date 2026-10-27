import { useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Calendar, FolderKanban, BookOpen, Bell, User, Shield, GraduationCap } from 'lucide-react';
import { useAuth } from '../store';

// ============ NAVBAR ============

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1">
            <span className="text-xl font-bold text-navy tracking-tight">heidekel</span>
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mt-1">Software Academy</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/courses" className={`text-sm font-medium transition-colors ${isActive('/courses') ? 'text-navy' : 'text-text-secondary hover:text-navy'}`}>Courses</Link>
            <Link to="/about" className={`text-sm font-medium transition-colors ${isActive('/about') ? 'text-navy' : 'text-text-secondary hover:text-navy'}`}>About</Link>
            <Link to="/faq" className={`text-sm font-medium transition-colors ${isActive('/faq') ? 'text-navy' : 'text-text-secondary hover:text-navy'}`}>FAQ</Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to={user?.role === 'admin' ? '/admin' : '/student/dashboard'}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy bg-blue-light rounded-lg hover:bg-navy/10 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-navy transition-colors">Login</Link>
                <Link to="/courses/ai-for-students" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors">
                  Enroll Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-navy"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <Link to="/courses" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-sm font-medium text-text-secondary hover:text-navy">Courses</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-sm font-medium text-text-secondary hover:text-navy">About</Link>
            <Link to="/faq" onClick={() => setMobileOpen(false)} className="block px-2 py-2 text-sm font-medium text-text-secondary hover:text-navy">FAQ</Link>
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              {isAuthenticated ? (
                <Link to={user?.role === 'admin' ? '/admin' : '/student/dashboard'} onClick={() => setMobileOpen(false)} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy bg-blue-light rounded-lg">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-sm font-medium text-text-secondary">Login</Link>
                  <Link to="/courses/ai-for-students" onClick={() => setMobileOpen(false)} className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-navy rounded-lg">Enroll Now</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

// ============ FOOTER ============

export function Footer() {
  return (
    <footer className="bg-navy-deep text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-1 mb-3">
              <span className="text-lg font-bold tracking-tight">heidekel</span>
              <span className="text-[9px] font-semibold text-white/60 uppercase tracking-widest mt-1">Software Academy</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Practical AI training for university students in Ghana. Build real workflows, not just prompts.
            </p>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Courses</h4>
            <ul className="space-y-2">
              <li><Link to="/courses/ai-for-students" className="text-sm text-white/70 hover:text-white transition-colors">AI for Students</Link></li>
              <li><Link to="/courses" className="text-sm text-white/70 hover:text-white transition-colors">All Courses</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-white/70 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/faq" className="text-sm text-white/70 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-sm text-white/70 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Policies</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-white/70 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-white/70 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="text-sm text-white/70 hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">© {new Date().getFullYear()} Heidekel Software Academy. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="text-white/50 hover:text-white transition-colors" aria-label="LinkedIn">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============ MARKETING LAYOUT ============

export function MarketingLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// ============ STUDENT LAYOUT ============

export function StudentLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'student') {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/student/cohort', label: 'My Cohort', icon: Calendar },
    { path: '/student/projects', label: 'Projects', icon: FolderKanban },
    { path: '/student/resources', label: 'Resources', icon: BookOpen },
    { path: '/student/announcements', label: 'Announcements', icon: Bell },
    { path: '/student/profile', label: 'Profile', icon: User },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-border px-4 h-14 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-text-secondary" aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="text-sm font-bold text-navy">heidekel</Link>
        <div className="w-9" />
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            <StudentSidebar navItems={navItems} location={location} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border overflow-y-auto">
          <StudentSidebar navItems={navItems} location={location} />
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function StudentSidebar({ navItems, location, onClose }: { navItems: { path: string; label: string; icon: any }[]; location: any; onClose?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-border">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-lg font-bold text-navy">heidekel</span>
          <span className="text-[9px] font-semibold text-text-secondary uppercase tracking-widest mt-0.5">Software Academy</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-light text-navy' : 'text-text-secondary hover:bg-bg-light hover:text-navy'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-text-main truncate">{user?.full_name}</p>
          <p className="text-xs text-text-secondary truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-error-light hover:text-error transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

// ============ ADMIN LAYOUT ============

export function AdminLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { path: '/admin', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/courses', label: 'Courses', icon: BookOpen },
    { path: '/admin/cohorts', label: 'Cohorts', icon: Calendar },
    { path: '/admin/enrollments', label: 'Enrollments', icon: GraduationCap },
    { path: '/admin/payments', label: 'Payments', icon: Shield },
    { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
    { path: '/admin/announcements', label: 'Announcements', icon: Bell },
  ];

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-border px-4 h-14 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-text-secondary" aria-label="Open menu">
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-bold text-navy">Admin Panel</span>
        <div className="w-9" />
      </div>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            <AdminSidebar navItems={navItems} location={location} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-border overflow-y-auto">
          <AdminSidebar navItems={navItems} location={location} />
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminSidebar({ navItems, location, onClose }: { navItems: { path: string; label: string; icon: any }[]; location: any; onClose?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-border">
        <Link to="/" className="flex items-center gap-1">
          <span className="text-lg font-bold text-navy">heidekel</span>
          <span className="text-[9px] font-semibold text-text-secondary uppercase tracking-widest mt-0.5 ml-1">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-light text-navy' : 'text-text-secondary hover:bg-bg-light hover:text-navy'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-medium text-text-main truncate">{user?.full_name}</p>
          <p className="text-xs text-text-secondary truncate">Administrator</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-error-light hover:text-error transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
