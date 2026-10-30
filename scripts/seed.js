const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Create admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@heidekel.com' },
    update: {},
    create: {
      email: 'admin@heidekel.com',
      passwordHash: adminPassword,
      fullName: 'System Administrator',
      phone: '+233201234567',
      role: 'ADMIN',
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create student user
  const studentPassword = await hash('student123', 12);
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      passwordHash: studentPassword,
      fullName: 'Kwame Asante',
      phone: '+233241234567',
      role: 'STUDENT',
    },
  });
  console.log('✅ Created student user:', student.email);

  // Create AI course
  const course = await prisma.course.upsert({
    where: { slug: 'ai-for-students' },
    update: {},
    create: {
      slug: 'ai-for-students',
      title: 'AI for Students: Practical Workflows',
      shortDescription: 'Learn to combine AI tools into practical workflows for studying, research, productivity, and projects.',
      description: 'This hands-on course teaches university students how to use AI tools effectively — not just as chatbots, but as integrated components of real workflows.',
      priceAmount: 35000, // GHS 350.00
      currency: 'GHS',
      prerequisites: ['Basic computer literacy', 'A laptop with internet access', 'Willingness to learn'],
      learningOutcomes: [
        'Build effective prompts for studying, research, and writing',
        'Combine multiple AI tools into integrated workflows',
        'Create custom AI assistants for specific tasks',
        'Automate repetitive academic tasks',
        'Develop reusable prompt templates and pipelines',
      ],
      certificateRequirements: [
        'Attend at least 80% of live sessions',
        'Complete all assigned projects',
        'Submit final capstone project',
        'Receive passing grade on project review',
      ],
      curriculum: [
        {
          id: 'mod-1',
          title: 'Foundations of AI Tools',
          description: 'Understanding the AI landscape',
          lessons: ['Introduction to AI tools', 'Setting up ChatGPT, Claude, Gemini'],
          duration: '2 sessions',
        },
        {
          id: 'mod-2',
          title: 'Prompt Engineering',
          description: 'Master the art of communicating with AI',
          lessons: ['Prompt structure', 'Chain-of-thought prompting', 'Iterative refinement'],
          duration: '2 sessions',
        },
      ],
      publishedAt: new Date(),
    },
  });
  console.log('✅ Created course:', course.title);

  // Create cohort
  const cohort = await prisma.cohort.create({
    data: {
      courseId: course.id,
      name: 'Cohort 1 — January 2026',
      startDate: new Date('2026-01-20'),
      endDate: new Date('2026-03-10'),
      enrollmentDeadline: new Date('2026-01-18'),
      capacity: 50,
      status: 'UPCOMING',
    },
  });
  console.log('✅ Created cohort:', cohort.name);

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Test credentials:');
  console.log('   Admin: admin@heidekel.com / admin123');
  console.log('   Student: student@example.com / student123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
