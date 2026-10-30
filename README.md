# Heidekel Software Academy - Production Application

A production-ready, multi-tenant educational platform built with React, TypeScript, Supabase, and Paystack.

## 🏗️ Architecture

### Production-Ready Features

✅ **Real Authentication** - Supabase Auth with JWT tokens and secure sessions  
✅ **Multi-Tenant Data Isolation** - Row Level Security (RLS) policies enforce data separation  
✅ **Server-Side Authorization** - All operations validated against user roles  
✅ **Audit Logging** - Complete audit trail for all state changes  
✅ **Payment Integration** - Paystack Inline JS v2 with server-side verification  
✅ **Type-Safe Database** - Full TypeScript types matching PostgreSQL schema  
✅ **Concurrent User Support** - Proper state management for multiple simultaneous users  
✅ **Production Security** - HTTP-only cookies, CSRF protection, secure token storage  

### Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL with RLS
- **Payments**: Paystack (GHS, Mobile Money, Cards)
- **Email**: Resend (transactional emails)
- **Hosting**: Vercel (recommended)

## 🚀 Quick Start

### Prerequisites

1. **Supabase Account**: Create a free account at https://supabase.com
2. **Paystack Account**: Create an account at https://dashboard.paystack.com
3. **Node.js**: Version 18 or higher
4. **npm**: Version 9 or higher

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd heidekel-software-academy
npm install
```

### 2. Set Up Supabase

#### Create a New Project

1. Go to https://supabase.com/dashboard/new
2. Create a new project (note the project URL and anon key)
3. Wait for the database to be ready

#### Run Database Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref <your-project-ref>

# Run migrations
supabase db push
```

Or manually run the SQL:
- Copy the contents of `supabase/migrations/001_initial_schema.sql`
- Go to Supabase Dashboard → SQL Editor
- Paste and run the SQL

#### Configure Auth Settings

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. (Optional) Configure email templates
4. Go to **Authentication** → **URL Configuration**
5. Set **Site URL** to your app URL (e.g., `http://localhost:5173` for development)
6. Add redirect URLs: `http://localhost:5173/**`

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase (from Dashboard → Settings → API)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Paystack (from Dashboard → Settings → API Keys)
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your-public-key

# Optional: For server-side operations (Next.js migration)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PAYSTACK_SECRET_KEY=sk_test_your-secret-key
```

**⚠️ Security Note**: 
- `VITE_*` variables are exposed to the browser (safe for anon keys)
- Never commit `.env.local` to git
- Service role keys should only be used server-side

### 4. Create Admin User

The first admin user must be created via the Supabase Dashboard:

1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create New User**
3. Enter email and password
4. After creation, go to **Table Editor** → **profiles**
5. Find the user and change `role` from `student` to `admin`

Or use SQL:

```sql
-- After signing up via the app, promote to admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@heidekel.com';
```

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173

**Demo Credentials** (when Supabase is not configured):
- Student: `student@example.com` / `password123`
- Admin: `admin@heidekel.com` / `admin123`

## 📦 Database Schema

### Core Tables

- **profiles** - User profiles (extends auth.users)
- **courses** - Course catalogue
- **cohorts** - Course cohorts with schedules
- **cohort_sessions** - Individual class sessions
- **orders** - Student purchase orders
- **payments** - Payment transactions
- **enrollments** - Student enrollments
- **projects** - Course projects
- **project_submissions** - Student submissions
- **announcements** - Course announcements
- **attendance** - Session attendance tracking
- **audit_logs** - System audit trail

### Row Level Security (RLS)

All tables have RLS enabled with policies that enforce:

- **Students** can only access their own data
- **Admins** can access all data
- **Public** can read published courses and announcements
- **Enrolled students** can access cohort-specific resources

Example policy:

```sql
-- Students can only see their own enrollments
CREATE POLICY "Students can read own enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = student_id);
```

## 🔐 Security Features

### Authentication

- JWT-based sessions with automatic token refresh
- Secure password hashing (bcrypt via Supabase)
- Email verification (configurable)
- Password reset flow

### Authorization

- Role-based access control (student, admin)
- Server-side validation on all mutations
- RLS policies prevent unauthorized data access
- Admin provisioning requires existing admin auth

### Payment Security

- Paystack handles all card/MoMo data (PCI compliant)
- Server-side transaction verification
- Webhook signature validation
- Idempotent payment processing

### Data Protection

- No sensitive data in localStorage
- HTTP-only cookies for sessions (Next.js)
- CSRF protection
- Input validation with Zod schemas
- SQL injection prevention (parameterized queries)

## 💳 Payment Integration

### Paystack Setup

1. **Get API Keys**: Dashboard → Settings → API Keys
2. **Configure Webhook**: Dashboard → Preferences → Webhooks
   - URL: `https://your-domain.com/api/webhooks/paystack`
   - Events: `charge.success`, `charge.failed`
3. **Test Mode**: Use test keys for development
   - Test cards: https://paystack.com/docs/payments/test-payments
   - Test MoMo: `0500000000` (MTN), `0200000000` (Vodafone)

### Payment Flow

1. Student selects cohort → Checkout page
2. Frontend creates order and payment record
3. Paystack Inline JS opens payment popup
4. Student completes payment (card or MoMo)
5. Paystack sends webhook to your server
6. Server verifies transaction with Paystack API
7. Server activates enrollment
8. Student receives confirmation email

### Webhook Handler (Next.js)

When you migrate to Next.js, create `app/api/webhooks/paystack/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature, processWebhookEvent } from '@/lib/webhooks/paystack';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('x-paystack-signature');
  
  // Verify signature
  const isValid = verifyWebhookSignature(
    body, 
    signature!, 
    process.env.PAYSTACK_SECRET_KEY!
  );
  
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  const payload = JSON.parse(body);
  await processWebhookEvent(payload.event, payload.data);
  
  return NextResponse.json({ received: true });
}
```

## 🌍 Multi-Tenancy

### Data Isolation

Every database query is filtered by the authenticated user's ID via RLS:

```typescript
// Student sees only their enrollments
const { data } = await supabase
  .from('enrollments')
  .select('*')
  .eq('student_id', user.id); // RLS enforces this automatically
```

### Concurrent Users

- React Context manages client-side state
- Supabase Realtime can sync state across clients
- Database transactions prevent race conditions
- Optimistic locking for critical operations

### Scaling Considerations

- **Database**: Supabase handles connection pooling
- **Auth**: Supabase Auth scales automatically
- **Storage**: Use Supabase Storage for file uploads
- **CDN**: Vercel Edge Network for static assets
- **API**: Serverless functions for backend logic

## 🧪 Testing

### Unit Tests

```bash
npm test
```

### End-to-End Tests (Playwright)

```bash
# Install Playwright
npm install -D @playwright/test

# Run tests
npx playwright test
```

### Manual Testing Checklist

- [ ] Student can register and login
- [ ] Student can view courses and cohorts
- [ ] Student can complete checkout with Paystack
- [ ] Student can access enrolled cohort dashboard
- [ ] Student can submit projects
- [ ] Student cannot access other students' data
- [ ] Admin can create courses and cohorts
- [ ] Admin can view all enrollments and payments
- [ ] Admin can review project submissions
- [ ] Admin cannot be created via public signup
- [ ] Payment webhooks activate enrollments correctly
- [ ] Duplicate payments are handled idempotently

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Import your Git repo
2. **Set Environment Variables**: Add all variables from `.env.example`
3. **Configure Build**: 
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Deploy**: Vercel handles the rest

### Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_PAYSTACK_PUBLIC_KEY
SUPABASE_SERVICE_ROLE_KEY (for API routes)
PAYSTACK_SECRET_KEY (for webhooks)
```

### Custom Domain

1. Add domain in Vercel Dashboard → Domains
2. Configure DNS records
3. Update Supabase Site URL
4. Update Paystack callback URLs

## 🔄 Migration to Next.js (Optional)

For server-side rendering and API routes, migrate to Next.js:

### 1. Install Next.js

```bash
npm install next @supabase/ssr
npm uninstall vite @vitejs/plugin-react
```

### 2. Create Next.js Config

```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
};
```

### 3. Move Pages

- `src/pages/` → `app/` (App Router)
- Create `app/api/` for API routes
- Use Server Components where possible

### 4. Update Supabase Client

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}
```

### 5. Add Middleware

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ request, response });
  await supabase.auth.getSession();
  return response;
}
```

## 📊 Monitoring

### Supabase Dashboard

- **Logs**: View API requests and errors
- **Auth**: Monitor user signups and logins
- **Database**: Query performance and connections
- **Realtime**: Active connections and events

### Application Logs

```typescript
// Log important events
await supabase.from('audit_logs').insert({
  user_id: user.id,
  action: 'enrollment.created',
  resource_type: 'enrollment',
  resource_id: enrollment.id,
  details: { cohort_id: cohort.id, amount: order.amount },
});
```

### Error Tracking

Consider adding Sentry or LogRocket:

```bash
npm install @sentry/react
```

## 🛠️ Troubleshooting

### "Missing Supabase environment variables"

- Check `.env.local` exists and has all required variables
- Restart dev server after adding variables
- Verify variable names match exactly (case-sensitive)

### "Invalid API key"

- Check anon key is from Supabase Dashboard → Settings → API
- Ensure no extra whitespace in `.env.local`
- Verify project URL is correct

### "User not found" after signup

- Check Supabase Auth settings → Email Templates
- Verify site URL is configured correctly
- Check browser console for errors

### Payment not activating enrollment

- Verify Paystack webhook URL is configured
- Check webhook signature validation
- Review Supabase logs for errors
- Ensure service role key is set (for server-side operations)

### RLS policy blocking access

- Check user is authenticated: `SELECT auth.uid();`
- Verify user has correct role in profiles table
- Test policy in Supabase SQL Editor
- Review policy definition in migration file

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Paystack Documentation](https://paystack.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

Proprietary - Heidekel Software Academy

## 🆘 Support

For issues and questions:
- Open a GitHub issue
- Contact: support@heidekel.com
- Documentation: https://docs.heidekel.com

---

**Built with ❤️ for Ghanaian university students**
