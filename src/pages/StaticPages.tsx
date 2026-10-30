import { Link } from 'react-router-dom';
import { ChevronDown, Mail, MapPin } from 'lucide-react';

// ============ ABOUT ============

export function AboutPage() {
  return (
    <div className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-main">About Heidekel</h1>
          <div className="mt-6 prose prose-sm max-w-none">
            <p className="text-lg text-text-secondary leading-relaxed">
              Heidekel Software Academy is a technology education brand offering practical, project-based AI training to university students in Ghana.
            </p>
            <p className="text-text-secondary leading-relaxed mt-4">
              We believe that AI literacy alone is not enough. Students need to learn how to combine AI tools into practical workflows that help them study, research, manage projects, improve productivity, and automate repetitive tasks.
            </p>
            <p className="text-text-secondary leading-relaxed mt-4">
              Our courses emphasize hands-on workflow development, prompt engineering, tool selection, automation, and reusable AI pipelines. We teach students to build with AI, not just use it.
            </p>

            <h2 className="text-xl font-bold text-text-main mt-10 mb-4">Our approach</h2>
            <ul className="space-y-3 text-text-secondary">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-navy rounded-full mt-2 flex-shrink-0" />
                <span><strong className="text-text-main">Project-based learning.</strong> Every module includes hands-on assignments and real projects.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-navy rounded-full mt-2 flex-shrink-0" />
                <span><strong className="text-text-main">Live cohort format.</strong> Interactive sessions with direct instructor access and peer collaboration.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-navy rounded-full mt-2 flex-shrink-0" />
                <span><strong className="text-text-main">Practical outcomes.</strong> Students leave with reusable workflows they can apply immediately.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-navy rounded-full mt-2 flex-shrink-0" />
                <span><strong className="text-text-main">Accessible pricing.</strong> Designed for university students with flexible payment options including Mobile Money.</span>
              </li>
            </ul>

            <h2 className="text-xl font-bold text-text-main mt-10 mb-4">Who we serve</h2>
            <p className="text-text-secondary leading-relaxed">
              Our primary audience is university students in Ghana who want to develop practical AI skills that complement their academic studies and prepare them for the modern workforce.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ FAQ ============

export function FAQPage() {
  const faqs = [
    {
      category: 'General',
      items: [
        { q: 'What is Heidekel Software Academy?', a: 'Heidekel is a technology education brand that offers practical, project-based AI training to university students in Ghana.' },
        { q: 'Who is the AI for Students course for?', a: 'The course is designed for university students who want to learn how to use AI tools effectively for studying, research, productivity, and projects. No prior AI experience is required.' },
        { q: 'Do I need prior programming experience?', a: 'No. The course focuses on practical AI workflows using accessible tools. Basic computer literacy is all you need.' },
      ]
    },
    {
      category: 'Course Format',
      items: [
        { q: 'How is the course delivered?', a: 'The course uses a live cohort format with interactive online sessions held twice a week. Sessions are supplemented with assignments, projects, and resources.' },
        { q: 'What are the session times?', a: 'Sessions are typically held on Tuesday and Thursday evenings (GMT). Exact times are confirmed when your cohort starts.' },
        { q: 'Are sessions recorded?', a: 'Yes, session recordings are made available to enrolled students in the Resources section of the student portal.' },
        { q: 'How long is the course?', a: 'The AI for Students course runs for approximately 7 weeks with 14 live sessions.' },
      ]
    },
    {
      category: 'Payment & Enrollment',
      items: [
        { q: 'How much does the course cost?', a: 'The course fee is GHS 350.00. This covers all sessions, materials, projects, and certificate upon completion.' },
        { q: 'Can I pay with Mobile Money?', a: 'Yes. We support MTN Mobile Money, Vodafone Cash, and AirtelTigo Money through our payment provider Paystack. Card payments are also accepted.' },
        { q: 'Is there an installment plan?', a: 'Payment plans may be available for certain cohorts. Contact us for current options.' },
        { q: 'What happens after I pay?', a: 'After successful payment verification, you\'ll receive an enrollment confirmation email and gain access to the student portal with your cohort details, schedule, and resources.' },
      ]
    },
    {
      category: 'Certificate & Completion',
      items: [
        { q: 'Will I receive a certificate?', a: 'Yes. Upon successful completion, you\'ll receive a Heidekel Software Academy certificate.' },
        { q: 'What are the completion requirements?', a: 'You need to attend at least 80% of live sessions, complete all assigned projects, submit the capstone project, and receive a passing grade on the project review.' },
      ]
    },
    {
      category: 'Refunds',
      items: [
        { q: 'What is the refund policy?', a: 'Full refund within 7 days of enrollment if the course has not yet started. After the course begins, partial refunds may be considered on a case-by-case basis.' },
        { q: 'How do I request a refund?', a: 'Contact us through the contact page or email. Include your enrollment details and reason for the refund request.' },
      ]
    }
  ];

  return (
    <div className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-main">Frequently asked questions</h1>
          <p className="mt-4 text-lg text-text-secondary">
            Everything you need to know about Heidekel and our courses.
          </p>
        </div>

        <div className="max-w-3xl space-y-10">
          {faqs.map((section, i) => (
            <div key={i}>
              <h2 className="text-lg font-semibold text-text-main mb-4">{section.category}</h2>
              <div className="space-y-3">
                {section.items.map((item, j) => (
                  <details key={j} className="group bg-white border border-border rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-bg-light transition-colors">
                      <span className="text-sm font-medium text-text-main pr-4">{item.q}</span>
                      <ChevronDown className="w-4 h-4 text-text-secondary flex-shrink-0 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-5 pb-5">
                      <p className="text-sm text-text-secondary leading-relaxed">{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-light rounded-xl border border-navy/10 max-w-3xl">
          <p className="text-sm text-text-main font-medium">Still have questions?</p>
          <p className="text-sm text-text-secondary mt-1">
            <Link to="/contact" className="text-navy font-medium hover:text-navy-deep">Contact us</Link> and we'll be happy to help.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============ CONTACT ============

export function ContactPage() {
  return (
    <div className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-main">Contact us</h1>
          <p className="mt-4 text-lg text-text-secondary">
            Have a question about our courses or need help with enrollment? Reach out and we'll get back to you.
          </p>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-8 max-w-4xl">
          <div>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-main mb-1.5">Full name</label>
                <input type="text" id="name" className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none transition-colors" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-main mb-1.5">Email</label>
                <input type="email" id="email" className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none transition-colors" placeholder="your@email.com" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text-main mb-1.5">Subject</label>
                <select id="subject" className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none transition-colors">
                  <option>Course inquiry</option>
                  <option>Enrollment help</option>
                  <option>Payment issue</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-main mb-1.5">Message</label>
                <textarea id="message" rows={5} className="w-full px-3 py-2.5 text-sm border border-border rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none transition-colors resize-none" placeholder="How can we help?" />
              </div>
              <button type="submit" className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors">
                Send message
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-bg-light rounded-xl p-6 border border-border">
              <h3 className="text-sm font-semibold text-text-main mb-3">Quick links</h3>
              <ul className="space-y-2">
                <li><Link to="/faq" className="text-sm text-navy hover:text-navy-deep">Frequently asked questions</Link></li>
                <li><Link to="/courses/ai-for-students" className="text-sm text-navy hover:text-navy-deep">AI for Students course</Link></li>
                <li><Link to="/refund-policy" className="text-sm text-navy hover:text-navy-deep">Refund policy</Link></li>
              </ul>
            </div>
            <div className="bg-bg-light rounded-xl p-6 border border-border">
              <h3 className="text-sm font-semibold text-text-main mb-3">Response time</h3>
              <p className="text-sm text-text-secondary">We typically respond within 24 hours on business days.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ PRIVACY POLICY ============

export function PrivacyPage() {
  return (
    <div className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-main">Privacy Policy</h1>
          <p className="mt-2 text-sm text-text-secondary">Last updated: January 2026</p>

          <div className="mt-8 space-y-6 text-sm text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">1. Information we collect</h2>
              <p>We collect information you provide directly, including your name, email address, phone number, and payment information when you register for a course. We also collect usage data such as login activity and course progress.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">2. How we use your information</h2>
              <p>We use your information to process enrollments, manage your student account, deliver course content, send transactional emails, and improve our services. We do not sell your personal information to third parties.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">3. Payment information</h2>
              <p>Payment processing is handled by Paystack. We do not store complete card details or Mobile Money PINs on our servers. Payment references and transaction statuses are stored for record-keeping.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">4. Data security</h2>
              <p>We implement appropriate security measures to protect your personal information, including encrypted connections, secure authentication, and access controls.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">5. Your rights</h2>
              <p>You may request access to, correction of, or deletion of your personal data by contacting us. We will respond to legitimate requests within a reasonable timeframe.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">6. Contact</h2>
              <p>For privacy-related inquiries, please <Link to="/contact" className="text-navy underline">contact us</Link>.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ TERMS OF SERVICE ============

export function TermsPage() {
  return (
    <div className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-main">Terms of Service</h1>
          <p className="mt-2 text-sm text-text-secondary">Last updated: January 2026</p>

          <div className="mt-8 space-y-6 text-sm text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">1. Acceptance of terms</h2>
              <p>By registering for a Heidekel course or using our platform, you agree to these terms. If you do not agree, please do not use our services.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">2. Course access</h2>
              <p>Course access is granted upon successful payment verification. Access is limited to the enrolled cohort and is non-transferable. Sharing login credentials or course materials with unauthorized persons is prohibited.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">3. Academic integrity</h2>
              <p>Students are expected to use AI tools ethically and in accordance with their institution's academic integrity policies. Heidekel is not responsible for how students apply AI tools in their academic work.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">4. Intellectual property</h2>
              <p>Course materials, recordings, and resources are the intellectual property of Heidekel Software Academy. Students retain ownership of their own project work and submissions.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">5. Limitation of liability</h2>
              <p>Heidekel provides courses on an "as is" basis. We do not guarantee specific outcomes or career results from completing our courses.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">6. Modifications</h2>
              <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ REFUND POLICY ============

export function RefundPolicyPage() {
  return (
    <div className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-main">Refund Policy</h1>
          <p className="mt-2 text-sm text-text-secondary">Last updated: January 2026</p>

          <div className="mt-8 space-y-6 text-sm text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">Full refund period</h2>
              <p>You may request a full refund within 7 days of enrollment, provided the course has not yet started. Refunds will be processed to the original payment method within 5–10 business days.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">After course start</h2>
              <p>After the course has started, refunds are generally not available. Exceptions may be considered on a case-by-case basis for documented circumstances (e.g., medical emergency). Contact us to discuss your situation.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">Course cancellation</h2>
              <p>If Heidekel cancels a cohort, all enrolled students will receive a full refund regardless of timing.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">Payment failures</h2>
              <p>If a payment fails or is reversed by the payment provider after enrollment has been activated, the enrollment will be suspended until the payment issue is resolved.</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-text-main mb-2">How to request a refund</h2>
              <p>To request a refund, <Link to="/contact" className="text-navy underline">contact us</Link> with your full name, email address, enrollment date, and reason for the request. We will respond within 3 business days.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
