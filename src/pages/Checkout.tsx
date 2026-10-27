import { useState } from 'react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Clock, CreditCard, Smartphone, Shield, ArrowRight } from 'lucide-react';
import { COHORTS, COURSES, useAuth, formatCurrency, formatDate } from '../store';

// ============ CHECKOUT ============

export function CheckoutPage() {
  const { cohortId } = useParams<{ cohortId: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const cohort = COHORTS.find(c => c.id === cohortId);
  const course = cohort ? COURSES.find(c => c.id === cohort.course_id) : null;

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    accept_terms: false,
  });
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card'>('momo');
  const [momoProvider, setMomoProvider] = useState('mtn');
  const [momoNumber, setMomoNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!cohort || !course) {
    return <Navigate to="/courses" replace />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-bg-light">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-text-main mb-2">Sign in to continue</h2>
          <p className="text-sm text-text-secondary mb-6">You need to be signed in to enroll in a course.</p>
          <div className="flex flex-col gap-3">
            <Link to="/login" className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep">
              Sign in
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-navy bg-blue-light rounded-lg hover:bg-navy/10">
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if cohort is enrollable
  if (cohort.status !== 'upcoming' && cohort.status !== 'active') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-bg-light">
        <div className="text-center max-w-md">
          <AlertCircle className="w-10 h-10 text-error mx-auto mb-3" />
          <h2 className="text-xl font-bold text-text-main mb-2">Enrollment closed</h2>
          <p className="text-sm text-text-secondary mb-4">This cohort is no longer accepting enrollments.</p>
          <Link to="/courses" className="text-sm font-medium text-navy hover:text-navy-deep">← View available courses</Link>
        </div>
      </div>
    );
  }

  if (cohort.enrolled_count >= cohort.capacity) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-bg-light">
        <div className="text-center max-w-md">
          <AlertCircle className="w-10 h-10 text-warning mx-auto mb-3" />
          <h2 className="text-xl font-bold text-text-main mb-2">Cohort is full</h2>
          <p className="text-sm text-text-secondary mb-4">This cohort has reached its capacity. Check back for future cohorts.</p>
          <Link to="/courses" className="text-sm font-medium text-navy hover:text-navy-deep">← View available courses</Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.accept_terms) {
      setError('Please accept the terms and refund policy to continue.');
      return;
    }

    if (paymentMethod === 'momo' && !momoNumber) {
      setError('Please enter your Mobile Money number.');
      return;
    }

    setLoading(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProcessing(true);

    // Simulate successful payment (in production, this would call Paystack API)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Navigate to success page
    navigate('/payment/success?reference=PS-' + Date.now());
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="py-8 sm:py-12 bg-bg-light min-h-[calc(100vh-64px)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to={`/courses/${course.slug}`} className="text-sm text-text-secondary hover:text-navy transition-colors">
            ← Back to course
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-text-main mb-6">Enrollment checkout</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student info */}
            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="text-base font-semibold text-text-main mb-4">Student information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="full_name" className="block text-sm font-medium text-text-main mb-1.5">Full name</label>
                  <input
                    type="text"
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => updateField('full_name', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
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
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
                    placeholder="+233 XX XXX XXXX"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="text-base font-semibold text-text-main mb-4">Payment method</h2>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`flex items-center gap-3 p-4 border rounded-lg transition-all ${
                    paymentMethod === 'momo' ? 'border-navy bg-blue-light' : 'border-border hover:border-navy/30'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-navy" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-text-main">Mobile Money</p>
                    <p className="text-xs text-text-secondary">MTN, Vodafone, AirtelTigo</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-3 p-4 border rounded-lg transition-all ${
                    paymentMethod === 'card' ? 'border-navy bg-blue-light' : 'border-border hover:border-navy/30'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-navy" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-text-main">Debit/Credit Card</p>
                    <p className="text-xs text-text-secondary">Visa, Mastercard</p>
                  </div>
                </button>
              </div>

              {paymentMethod === 'momo' && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-text-main mb-2">Select provider</label>
                    <div className="flex gap-2">
                      {[
                        { id: 'mtn', label: 'MTN MoMo', color: 'bg-yellow-400' },
                        { id: 'vodafone', label: 'Vodafone Cash', color: 'bg-red-500' },
                        { id: 'airteltigo', label: 'AT Money', color: 'bg-blue-500' },
                      ].map(provider => (
                        <button
                          key={provider.id}
                          type="button"
                          onClick={() => setMomoProvider(provider.id)}
                          className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-xs font-medium transition-all ${
                            momoProvider === provider.id ? 'border-navy bg-blue-light text-navy' : 'border-border text-text-secondary hover:border-navy/30'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${provider.color}`} />
                          {provider.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="momo_number" className="block text-sm font-medium text-text-main mb-1.5">Mobile Money number</label>
                    <input
                      type="tel"
                      id="momo_number"
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none"
                      placeholder="0XX XXX XXXX"
                    />
                    <p className="mt-1.5 text-xs text-text-secondary">You'll receive a prompt on your phone to authorize the payment.</p>
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="pt-2">
                  <p className="text-sm text-text-secondary">
                    You'll be redirected to a secure payment page to enter your card details. Your card information is processed securely by Paystack and never stored on our servers.
                  </p>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="bg-white border border-border rounded-xl p-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.accept_terms}
                  onChange={(e) => updateField('accept_terms', e.target.checked)}
                  className="w-4 h-4 rounded border-border text-navy focus:ring-navy/20 mt-0.5"
                />
                <span className="text-sm text-text-secondary">
                  I agree to the <Link to="/terms" className="text-navy underline">Terms of Service</Link> and understand the <Link to="/refund-policy" className="text-navy underline">Refund Policy</Link>. I confirm that the information provided is accurate.
                </span>
              </label>
            </div>

            {error && (
              <div className="p-3 bg-error-light border border-error/20 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || processing}
              className="w-full py-3 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing payment...
                </>
              ) : loading ? (
                'Please wait...'
              ) : (
                <>
                  Pay {formatCurrency(course.price_amount)}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-border rounded-xl p-6 sticky top-24">
              <h2 className="text-base font-semibold text-text-main mb-4">Order summary</h2>
              <div className="space-y-3 pb-4 border-b border-border">
                <div>
                  <p className="text-sm font-medium text-text-main">{course.title}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{cohort.name}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Starts {formatDate(cohort.start_date)}</span>
                </div>
              </div>
              <div className="py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Course fee</span>
                  <span className="text-sm font-medium text-text-main">{formatCurrency(course.price_amount)}</span>
                </div>
              </div>
              <div className="py-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-text-main">Total</span>
                  <span className="text-lg font-bold text-navy">{formatCurrency(course.price_amount)}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-text-secondary">
                    Secure payment processed by Paystack. Your payment information is encrypted and never stored on our servers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ PAYMENT SUCCESS ============

export function PaymentSuccessPage() {
  const { isAuthenticated, user } = useAuth();
  const reference = new URLSearchParams(window.location.search).get('reference');

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-bg-light">
      <div className="max-w-md w-full text-center">
        <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
          <div className="w-14 h-14 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-success" />
          </div>
          <h1 className="text-xl font-bold text-text-main mb-2">Payment successful!</h1>
          <p className="text-sm text-text-secondary mb-6">
            Your enrollment has been confirmed. You now have access to the student portal.
          </p>

          {reference && (
            <div className="bg-bg-light rounded-lg p-3 mb-6">
              <p className="text-xs text-text-secondary">Payment reference</p>
              <p className="text-sm font-mono font-medium text-text-main">{reference}</p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              to="/student/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors"
            >
              Go to Student Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/student/cohort"
              className="w-full inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-navy bg-blue-light rounded-lg hover:bg-navy/10 transition-colors"
            >
              View Cohort Schedule
            </Link>
          </div>
        </div>

        <p className="mt-4 text-xs text-text-secondary">
          A confirmation email has been sent to your email address.
        </p>
      </div>
    </div>
  );
}

// ============ PAYMENT PENDING ============

export function PaymentPendingPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-bg-light">
      <div className="max-w-md w-full text-center">
        <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
          <div className="w-14 h-14 bg-warning-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7 text-warning" />
          </div>
          <h1 className="text-xl font-bold text-text-main mb-2">Payment pending</h1>
          <p className="text-sm text-text-secondary mb-6">
            Your Mobile Money payment is being processed. This may take a few minutes. Please check your phone for a payment authorization prompt.
          </p>

          <div className="bg-bg-light rounded-lg p-4 mb-6 text-left">
            <p className="text-xs font-medium text-text-main mb-2">What to do:</p>
            <ul className="space-y-1.5 text-xs text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-navy rounded-full mt-1.5 flex-shrink-0" />
                Check your phone for a payment prompt
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-navy rounded-full mt-1.5 flex-shrink-0" />
                Enter your MoMo PIN to authorize
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-navy rounded-full mt-1.5 flex-shrink-0" />
                Wait for confirmation (up to 5 minutes)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-navy rounded-full mt-1.5 flex-shrink-0" />
                Refresh this page to check status
              </li>
            </ul>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="w-full inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-navy bg-blue-light rounded-lg hover:bg-navy/10 transition-colors"
          >
            Check payment status
          </button>
        </div>

        <p className="mt-4 text-xs text-text-secondary">
          If you've already authorized the payment but this page still shows pending, please <Link to="/contact" className="text-navy underline">contact us</Link>.
        </p>
      </div>
    </div>
  );
}

// ============ PAYMENT FAILED ============

export function PaymentFailedPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12 bg-bg-light">
      <div className="max-w-md w-full text-center">
        <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
          <div className="w-14 h-14 bg-error-light rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-error" />
          </div>
          <h1 className="text-xl font-bold text-text-main mb-2">Payment failed</h1>
          <p className="text-sm text-text-secondary mb-6">
            Your payment could not be processed. This could be due to insufficient funds, network issues, or an expired session.
          </p>

          <div className="space-y-3">
            <Link
              to="/courses/ai-for-students"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors"
            >
              Try again
            </Link>
            <Link
              to="/contact"
              className="w-full inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-navy bg-blue-light rounded-lg hover:bg-navy/10 transition-colors"
            >
              Contact support
            </Link>
          </div>
        </div>

        <p className="mt-4 text-xs text-text-secondary">
          No charges were made to your account. If you believe you were charged incorrectly, please contact us immediately.
        </p>
      </div>
    </div>
  );
}
