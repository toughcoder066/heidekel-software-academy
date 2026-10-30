import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, Users, Calendar, Award, BookOpen, ChevronDown, AlertCircle } from 'lucide-react';
import { COURSES, COHORTS, getCourseBySlug, formatCurrency, formatDate } from '../store';
import { useCohorts } from '../lib/cohort-context';

function getNextCohort(courseId: string, cohorts: any[]) {
  return cohorts.find(c => c.course_id === courseId && (c.status === 'upcoming' || c.status === 'active'));
}

// ============ COURSES CATALOGUE ============

export function CoursesPage() {
  const { cohorts } = useCohorts();
  const publishedCourses = COURSES.filter(c => c.published_at);

  return (
    <div className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-main">Courses</h1>
          <p className="mt-4 text-lg text-text-secondary">
            Practical, project-based technology courses designed for university students.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedCourses.map(course => {
            const nextCohort = getNextCohort(course.id, cohorts);
            return (
              <Link
                key={course.id}
                to={`/courses/${course.slug}`}
                className="group bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-navy/20 transition-all"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-navy to-navy-deep relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white/20" />
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-white bg-navy-deep/80 backdrop-blur-sm rounded-full">
                      <span className={`w-1.5 h-1.5 rounded-full ${nextCohort?.status === 'active' ? 'bg-success animate-pulse' : 'bg-white/60'}`} />
                      {nextCohort ? (nextCohort.status === 'active' ? 'Enrolling' : 'Coming Soon') : 'No upcoming cohort'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-text-main group-hover:text-navy transition-colors">
                    {course.title}
                  </h2>
                  <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                    {course.short_description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-navy">{formatCurrency(course.price_amount)}</span>
                    {nextCohort && (
                      <span className="text-xs text-text-secondary">
                        Starts {formatDate(nextCohort.start_date)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {publishedCourses.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-text-secondary/30 mx-auto mb-4" />
            <p className="text-text-secondary">No courses available at this time. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ COURSE DETAIL ============

export function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { cohorts, getCohortsByCourse } = useCohorts();
  const course = getCourseBySlug(slug || '');

  if (!course) {
    return (
      <div className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertCircle className="w-12 h-12 text-text-secondary/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-main mb-2">Course not found</h1>
          <p className="text-text-secondary mb-6">The course you're looking for doesn't exist or hasn't been published.</p>
          <Link to="/courses" className="text-sm font-medium text-navy hover:text-navy-deep">
            ← Back to courses
          </Link>
        </div>
      </div>
    );
  }

  const courseCohorts = getCohortsByCourse(course.id);
  const nextCohort = getNextCohort(course.id, cohorts);
  const isEnrollable = nextCohort && (nextCohort.status === 'upcoming' || nextCohort.status === 'active') && nextCohort.enrolled_count < nextCohort.capacity;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-bg-light to-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-navy mb-6 transition-colors">
              ← All courses
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-main leading-tight">
              {course.title}
            </h1>
            <p className="mt-4 text-lg text-text-secondary leading-relaxed">
              {course.short_description}
            </p>

            {/* Key info */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Clock className="w-4 h-4 text-navy" />
                <span>{course.curriculum.length} modules · 14 sessions</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Users className="w-4 h-4 text-navy" />
                <span>Live cohort</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Award className="w-4 h-4 text-navy" />
                <span>Certificate on completion</span>
              </div>
            </div>

            {/* Price and CTA */}
            <div className="mt-8 p-5 bg-white border border-border rounded-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-2xl font-bold text-navy">{formatCurrency(course.price_amount)}</p>
                  {nextCohort && (
                    <p className="text-sm text-text-secondary mt-1">
                      Next cohort: <span className="font-medium text-text-main">{nextCohort.name}</span>
                    </p>
                  )}
                </div>
                {isEnrollable ? (
                  <Link
                    to={`/checkout/${nextCohort.id}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-all shadow-sm"
                  >
                    Enroll Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center px-6 py-3 text-sm font-medium text-text-secondary bg-bg-light rounded-lg border border-border">
                    Enrollment closed
                  </span>
                )}
              </div>
              {nextCohort && (
                <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-text-secondary">Start Date</p>
                    <p className="text-sm font-medium text-text-main">{formatDate(nextCohort.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">End Date</p>
                    <p className="text-sm font-medium text-text-main">{formatDate(nextCohort.end_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Enrollment Deadline</p>
                    <p className="text-sm font-medium text-text-main">{formatDate(nextCohort.enrollment_deadline)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-text-main mb-6">Who this course is for</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                'University students who want to use AI effectively',
                'Students looking to improve study and research workflows',
                'Anyone who wants to build practical AI skills, not just theory',
                'Students interested in automation and productivity',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Outcomes */}
      <section className="py-12 sm:py-16 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-text-main mb-6">What you'll learn</h2>
            <div className="space-y-3">
              {course.learning_outcomes.map((outcome, i) => (
                <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-border">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-light rounded-full flex items-center justify-center text-xs font-bold text-navy">
                    {i + 1}
                  </span>
                  <span className="text-sm text-text-main">{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-text-main mb-6">Detailed curriculum</h2>
            <div className="space-y-3">
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
                    <span className="flex-shrink-0 text-xs text-text-secondary font-medium hidden sm:block">{mod.duration}</span>
                    <ChevronDown className="w-4 h-4 text-text-secondary group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-5 pb-5">
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
          </div>
        </div>
      </section>

      {/* Prerequisites */}
      <section className="py-12 sm:py-16 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-text-main mb-6">Prerequisites</h2>
            <div className="bg-white border border-border rounded-xl p-6">
              <ul className="space-y-3">
                {course.prerequisites.map((prereq, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-navy/40 flex-shrink-0 mt-0.5" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Requirements */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-text-main mb-6">Certificate requirements</h2>
            <div className="bg-blue-light border border-navy/10 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <Award className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
                <p className="text-sm text-text-main">
                  Upon successful completion, you'll receive a Heidekel Software Academy certificate.
                </p>
              </div>
              <ul className="space-y-2 ml-8">
                {course.certificate_requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="w-1.5 h-1.5 bg-navy rounded-full mt-2 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cohort Schedule */}
      {courseCohorts.length > 0 && (
        <section className="py-12 sm:py-16 bg-bg-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-text-main mb-6">Available cohorts</h2>
              <div className="space-y-4">
                {courseCohorts.map(cohort => (
                  <div key={cohort.id} className="bg-white border border-border rounded-xl p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-text-main">{cohort.name}</h3>
                        <p className="text-sm text-text-secondary mt-1">
                          {formatDate(cohort.start_date)} — {formatDate(cohort.end_date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
                          cohort.status === 'active' ? 'bg-success-light text-success' :
                          cohort.status === 'upcoming' ? 'bg-blue-light text-navy' :
                          cohort.status === 'completed' ? 'bg-bg-light text-text-secondary' :
                          'bg-error-light text-error'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            cohort.status === 'active' ? 'bg-success' :
                            cohort.status === 'upcoming' ? 'bg-navy' :
                            cohort.status === 'completed' ? 'bg-text-secondary' :
                            'bg-error'
                          }`} />
                          {cohort.status.charAt(0).toUpperCase() + cohort.status.slice(1)}
                        </span>
                        {(cohort.status === 'upcoming' || cohort.status === 'active') && cohort.enrolled_count < cohort.capacity && (
                          <Link
                            to={`/checkout/${cohort.id}`}
                            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-navy rounded-lg hover:bg-navy-deep transition-colors"
                          >
                            Enroll
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex items-center gap-4 text-xs text-text-secondary">
                      <span>{cohort.enrolled_count}/{cohort.capacity} enrolled</span>
                      <span>Deadline: {formatDate(cohort.enrollment_deadline)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Refund Policy */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-text-main mb-4">Refund policy</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Full refund available within 7 days of enrollment if the course has not yet started. 
              After the course begins, partial refunds may be considered on a case-by-case basis. 
              See our <Link to="/refund-policy" className="text-navy underline">full refund policy</Link> for details.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Start building with AI today
          </h2>
          <p className="text-white/80 max-w-lg mx-auto mb-6">
            Join the next cohort and develop practical AI workflows for your academic career.
          </p>
          {isEnrollable ? (
            <Link
              to={`/checkout/${nextCohort!.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-navy bg-white rounded-lg hover:bg-white/90 transition-colors shadow-lg"
            >
              Enroll Now — {formatCurrency(course.price_amount)}
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <p className="text-white/60 text-sm">Enrollment is currently closed. Check back for the next cohort.</p>
          )}
        </div>
      </section>
    </div>
  );
}
