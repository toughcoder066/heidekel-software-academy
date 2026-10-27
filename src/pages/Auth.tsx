import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../store';

// ============ LOGIN ============

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/student/dashboard'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    if (success) {
      navigate('/student/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-bg-light">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1 mb-6">
            <span className="text-xl font-bold text-navy tracking-tight">heidekel</span>
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mt-1">Software Academy</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-main">Welcome back</h1>
          <p className="mt-2 text-sm text-text-secondary">Sign in to access your student portal</p>
        </div>

        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-error-light border border-error/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-main mb-1.5">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-main mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none transition-colors pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border text-navy focus:ring-navy/20" />
                <span className="text-sm text-text-secondary">Remember me</span>
              </label>
              <Link to="/reset-password" className="text-sm font-medium text-navy hover:text-navy-deep">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-center text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-navy hover:text-navy-deep">Create account</Link>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-blue-light border border-navy/10 rounded-xl">
          <p className="text-xs font-medium text-navy mb-2">Demo credentials:</p>
          <div className="space-y-1 text-xs text-text-secondary">
            <p><span className="font-medium">Student:</span> student@example.com / password123</p>
            <p><span className="font-medium">Admin:</span> admin@heidekel.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ REGISTER ============

export function RegisterPage() {
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', password: '', confirm_password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/student/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    const result = await register({
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });

    if (result) {
      setSuccess(true);
      setTimeout(() => navigate('/student/dashboard'), 1500);
    } else {
      setError('Registration failed. This email may already be in use.');
    }
    setLoading(false);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-bg-light">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1 mb-6">
            <span className="text-xl font-bold text-navy tracking-tight">heidekel</span>
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mt-1">Software Academy</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-main">Create your account</h1>
          <p className="mt-2 text-sm text-text-secondary">Join Heidekel to enroll in courses and access your student portal</p>
        </div>

        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-error-light border border-error/20 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-success-light border border-success/20 rounded-lg flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
              <p className="text-sm text-success">Account created successfully! Redirecting...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-text-main mb-1.5">Full name</label>
              <input
                type="text"
                id="full_name"
                value={formData.full_name}
                onChange={(e) => updateField('full_name', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none transition-colors"
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-main mb-1.5">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-text-main mb-1.5">Phone number</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none transition-colors"
                placeholder="+233 XX XXX XXXX"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-main mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none transition-colors pr-10"
                  placeholder="At least 8 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-text-main mb-1.5">Confirm password</label>
              <input
                type="password"
                id="confirm_password"
                value={formData.confirm_password}
                onChange={(e) => updateField('confirm_password', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none transition-colors"
                placeholder="Repeat your password"
                required
              />
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="w-4 h-4 rounded border-border text-navy focus:ring-navy/20 mt-0.5" required />
              <label htmlFor="terms" className="text-xs text-text-secondary">
                I agree to the <Link to="/terms" className="text-navy underline">Terms of Service</Link> and <Link to="/privacy" className="text-navy underline">Privacy Policy</Link>
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-center text-sm text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-navy hover:text-navy-deep">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ RESET PASSWORD ============

export function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-bg-light">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1 mb-6">
            <span className="text-xl font-bold text-navy tracking-tight">heidekel</span>
            <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest mt-1">Software Academy</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-main">Reset your password</h1>
          <p className="mt-2 text-sm text-text-secondary">Enter your email and we'll send you a reset link</p>
        </div>

        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-3" />
              <p className="text-sm text-text-main font-medium">Check your email</p>
              <p className="text-sm text-text-secondary mt-1">
                If an account exists with that email, we've sent a password reset link.
              </p>
              <Link to="/login" className="mt-4 inline-block text-sm font-medium text-navy hover:text-navy-deep">
                ← Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-main mb-1.5">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors"
              >
                Send reset link
              </button>
            </form>
          )}

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-center text-sm text-text-secondary">
              <Link to="/login" className="font-medium text-navy hover:text-navy-deep">← Back to login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
