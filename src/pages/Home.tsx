import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, Users, Award, BookOpen, Zap, Target, MessageSquare, BarChart3, ChevronDown } from 'lucide-react';
import { COURSES, formatCurrency } from '../store';
import { useCohorts } from '../lib/cohort-context';

export default function Home() {
  const { cohorts } = useCohorts();
  const course = COURSES[0];
  const nextCohort = cohorts.find(c => c.course_id === course.id && (c.status === 'upcoming' || c.status === 'active'));

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-bg-light to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-navy bg-blue-light rounded-full">
                  <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                  Live Cohort
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-text-secondary bg-white border border-border rounded-full">
                  Hands-on Projects
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-text-secondary bg-white border border-border rounded-full">
                  Certificate on Completion
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-main leading-[1.1] tracking-tight text-balance">
                Don't just use AI.{' '}
                <span className="text-navy">Build with it.</span>
              </h1>

              <p className="mt-6 text-lg text-text-secondary leading-relaxed max-w-lg">
                Learn to combine AI tools into practical workflows for studying, research, productivity, and projects. Built for university students in Ghana who want real skills, not just theory.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/courses/ai-for-students"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-all shadow-sm hover:shadow-md"
                >
                  Explore the AI Course
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/courses/ai-for-students#curriculum"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-navy bg-white border border-border rounded-lg hover:bg-bg-light transition-colors"
                >
                  See What You'll Build
                </Link>
              </div>

              {nextCohort && (
                <p className="mt-6 text-sm text-text-secondary">
                  Next cohort starts <span className="font-medium text-text-main">{new Date(nextCohort.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  {' · '}
                  <span className="font-medium text-navy">{formatCurrency(course.price_amount)}</span>
                </p>
              )}
            </div>

            {/* Hero Image */}
            <div className="relative lg:pl-8">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-navy/10 aspect-[4/3]">
                <img
                  src="https://image.qwenlm.ai/generated-images/1b7bcee9-3099-4ddd-a3d7-4c2cb1a6b2da/_result.png"
                  alt="Students collaborating on laptops"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/20 to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-border p-4 max-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-success-light rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-sm font-semibold text-text-main">7 Modules</span>
                </div>
                <p className="text-xs text-text-secondary">Practical, project-based learning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems & Outcomes */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-main">
              Real challenges. Real solutions.
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Every student faces these problems. This course teaches you to solve them with AI.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: 'Understanding Difficult Concepts', problem: 'Struggling with complex topics in lectures and textbooks', solution: 'AI-powered explanation workflows that break things down step by step' },
              { icon: Target, title: 'Organising Study & Research', problem: 'Information overload and scattered notes', solution: 'Structured AI workflows for research synthesis and knowledge management' },
              { icon: MessageSquare, title: 'Preparing Presentations', problem: 'Spending hours on slides and content structure', solution: 'AI-assisted outlining, content generation, and visual planning' },
              { icon: Zap, title: 'Combining Multiple AI Tools', problem: 'Using tools randomly without a strategy', solution: 'Integrated pipelines that chain tools together for better results' },
              { icon: BarChart3, title: 'Managing Projects', problem: 'Missing deadlines and losing track of tasks', solution: 'AI-powered project planning, scheduling, and progress tracking' },
              { icon: Clock, title: 'Automating Repetitive Work', problem: 'Wasting time on tasks that could be automated', solution: 'No-code automations that handle routine work for you' },
            ].map((item, i) => (
              <div key={i} className="group p-6 rounded-xl border border-border hover:border-navy/20 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-blue-light rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-navy" />
                </div>
                <h3 className="text-base font-semibold text-text-main mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary mb-3">
                  <span className="font-medium text-error/80">Problem:</span> {item.problem}
                </p>
                <p className="text-sm text-text-secondary">
                  <span className="font-medium text-success">Solution:</span> {item.solution}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Students Will Build */}
      <section className="py-16 sm:py-20 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-main">
              What you'll build
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Practical, reusable AI workflows you can use throughout your academic career.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: 'Study Assistant Prompts', desc: 'Custom prompt templates for explaining concepts, generating flashcards, and creating practice questions', tag: 'Reusable' },
              { title: 'Research Pipeline', desc: 'End-to-end workflow from topic exploration to literature synthesis to structured outlines', tag: 'Workflow' },
              { title: 'Custom AI Assistant', desc: 'A task-specific AI assistant configured for your subject area and study style', tag: 'Custom' },
              { title: 'Automation System', desc: 'A no-code automation that handles a repetitive task in your academic life', tag: 'Automation' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
                <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-navy bg-blue-light rounded mb-3">
                  {item.tag}
                </span>
                <h3 className="text-sm font-semibold text-text-main mb-2">{item.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-xs text-text-secondary">
            Illustrative examples. Actual projects depend on your chosen subject area and interests.
          </p>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section id="curriculum" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-main">
              Course curriculum
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              7 modules over 7 weeks. Each module builds on the last.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {course.curriculum.map((mod, i) => (
              <details key={mod.id} className="group border border-border rounded-xl overflow-hidden">
                <summary className="flex items-center gap-4 p-5 cursor-pointer hover:bg-bg-light transition-colors">
                  <span className="flex-shrink-0 w-8 h-8 bg-navy text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-text-main">{mod.title}</h3>
                    <p className="text-xs text-text-secondary mt-0.5">{mod.description}</p>
                  </div>
                  <span className="flex-shrink-0 text-xs text-text-secondary font-medium">{mod.duration}</span>
                  <ChevronDown className="w-4 h-4 text-text-secondary group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-5 pb-5 pl-17">
                  <ul className="space-y-2 ml-12">
                    {mod.lessons.map((lesson, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CheckCircle2 className="w-3.5 h-3.5 text-navy/40 mt-0.5 flex-shrink-0" />
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/courses/ai-for-students#curriculum"
              className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-navy-deep transition-colors"
            >
              View full curriculum details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How the Cohort Works */}
      <section className="py-16 sm:py-20 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-main">
              How the cohort works
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Structured, supportive, and hands-on. Not just videos — real learning.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Live Sessions', desc: 'Join interactive online classes twice a week. Ask questions, practice together, get immediate feedback.' },
              { step: '02', title: 'Practical Assignments', desc: 'Apply what you learn with hands-on assignments after each session. Build real workflows, not just notes.' },
              { step: '03', title: 'Guided Projects', desc: 'Work on structured projects with clear requirements. Get instructor guidance and peer collaboration.' },
              { step: '04', title: 'Feedback & Review', desc: 'Receive detailed feedback on your work. Iterate, improve, and build a portfolio of AI workflows.' },
            ].map((item, i) => (
              <div key={i} className="relative bg-white rounded-xl border border-border p-6">
                <span className="text-3xl font-bold text-navy/10">{item.step}</span>
                <h3 className="text-base font-semibold text-text-main mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-navy to-navy-deep flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-white">H</span>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-text-main mb-2">Your Instructor</h2>
                <p className="text-text-secondary leading-relaxed mb-4">
                  This course is led by experienced practitioners who build with AI tools daily. The instructor brings real-world workflow expertise and a passion for helping students develop practical AI skills.
                </p>
                <p className="text-sm text-text-secondary">
                  Instructor details are managed through the admin portal and can be updated at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 sm:py-20 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-main">
              Frequently asked questions
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {[
              { q: 'Do I need prior AI experience?', a: 'No. You just need basic computer literacy and a willingness to learn. We start from the fundamentals and build up.' },
              { q: 'What tools will I need?', a: 'A laptop with internet access and free accounts on major AI platforms (ChatGPT, Claude, Gemini). All tools used in the course are free or have free tiers.' },
              { q: 'When are the live sessions?', a: 'Sessions are held twice a week, typically Tuesday and Thursday evenings (GMT). Exact times are confirmed when your cohort starts.' },
              { q: 'Can I pay with Mobile Money?', a: 'Yes. We support Mobile Money (MTN, Vodafone, AirtelTigo) as well as card payments through Paystack.' },
              { q: 'Will I get a certificate?', a: 'Yes, upon successful completion. You need to attend at least 80% of sessions, complete all projects, and pass the capstone review.' },
              { q: 'What is the refund policy?', a: 'Full refund within 7 days of enrollment if the course hasn\'t started. See our refund policy page for full details.' },
            ].map((item, i) => (
              <details key={i} className="group bg-white border border-border rounded-xl overflow-hidden">
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

          <div className="text-center mt-8">
            <Link to="/faq" className="text-sm font-medium text-navy hover:text-navy-deep transition-colors">
              View all FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to build with AI?
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
            Join the next cohort and start building practical AI workflows that will transform how you study, research, and work.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/courses/ai-for-students"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-navy bg-white rounded-lg hover:bg-white/90 transition-colors shadow-lg"
            >
              Enroll Now — {formatCurrency(course.price_amount)}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
            >
              Have questions?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
