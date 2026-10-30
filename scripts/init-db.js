#!/usr/bin/env node
const { execSync } = require('child_process');

console.log('🚀 Initializing Heidekel Database...\n');

try {
  // Generate Prisma Client
  console.log('📦 Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push schema to database
  console.log('\n🗄️  Pushing schema to Supabase database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('\n✅ Database initialized successfully!');
  console.log('\n📋 Next steps:');
  console.log('   1. Create an admin user: npm run seed');
  console.log('   2. Start the dev server: npm run dev');
  console.log('   3. Visit http://localhost:3000\n');
  
} catch (error) {
  console.error('\n❌ Error initializing database:', error.message);
  process.exit(1);
}
