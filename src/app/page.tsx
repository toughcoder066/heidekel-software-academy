import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-navy mb-6">
            Heidekel Software Academy
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Practical AI training for university students in Ghana. 
            Learn to combine AI tools into workflows for studying, research, productivity, and projects.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy-deep transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-navy border-2 border-navy rounded-lg hover:bg-blue-light transition-colors"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-navy mb-2">🔐 Secure Auth</h3>
            <p className="text-text-secondary">NextAuth.js with credentials provider and JWT sessions</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-navy mb-2">🗄️ Prisma ORM</h3>
            <p className="text-text-secondary">Type-safe database queries with Supabase PostgreSQL</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-navy mb-2">🚀 Next.js 14</h3>
            <p className="text-text-secondary">App Router, Server Components, and API Routes</p>
          </div>
        </div>
      </div>
    </main>
  );
}
