import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);

// Inline the createUserWithQuotas function to avoid circular dependencies
async function createUserWithQuotas(
  userId: string,
  email: string,
  name?: string
) {
  try {
    // Create or update user
    const [user] = await sql`
      INSERT INTO users (id, email, name) 
      VALUES (${userId}, ${email}, ${name})
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        updated_at = now()
      RETURNING *
    `;

    // Create default quotas for each generation type
    await sql`
      INSERT INTO quotas (user_id, generation_type, daily_limit, monthly_limit) 
      VALUES 
        (${userId}, 'IMAGE', 10, 250),
        (${userId}, 'VIDEO', 2, 20),
        (${userId}, 'MUSIC', 3, 30)
      ON CONFLICT DO NOTHING
    `;

    // Create initial usage tracking records
    await sql`
      INSERT INTO user_usage (user_id, type, count, last_used)
      VALUES 
        (${userId}, 'IMAGE', 0, now()),
        (${userId}, 'VIDEO', 0, now()),
        (${userId}, 'MUSIC', 0, now())
      ON CONFLICT DO NOTHING
    `;

    return user;
  } catch (error) {
    console.error('Error creating user with quotas:', error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create a test user for development (optional)
    const testUserId = 'test-user-id-12345';
    const testUserEmail = 'test@example.com';
    const testUserName = 'Test User';

    console.log('👤 Creating test user with quotas...');
    await createUserWithQuotas(testUserId, testUserEmail, testUserName);
    console.log('✅ Test user created successfully');

    // Create some sample audit logs
    console.log('📝 Creating sample audit logs...');
    await sql`
      INSERT INTO audit_logs (user_id, action, input, status, system) 
      VALUES 
        (${testUserId}, 'SYSTEM_INIT', 'Database seeding', 'SUCCESS', 'seeding-script'),
        (NULL, 'SYSTEM_INIT', 'Anonymous system initialization', 'SUCCESS', 'seeding-script')
    `;
    console.log('✅ Sample audit logs created');

    // Verify the setup by checking quotas
    console.log('🔍 Verifying setup...');
    const quotas = await sql`SELECT * FROM quotas WHERE user_id = ${testUserId}`;
    console.log(`✅ Created ${quotas.length} quota records for test user`);

    const usageStats = await sql`SELECT * FROM user_usage WHERE user_id = ${testUserId}`;
    console.log(`✅ Created ${usageStats.length} usage tracking records for test user`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`- Test user ID: ${testUserId}`);
    console.log(`- Test user email: ${testUserEmail}`);
    console.log(`- Quotas created: ${quotas.length}`);
    console.log(`- Usage stats created: ${usageStats.length}`);
    console.log('');
    console.log('🔧 Next steps:');
    console.log('1. Test authentication with Stack Auth');
    console.log('2. Try the quota check API endpoints');
    console.log('3. Test generation recording');

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

async function clearDatabase() {
  try {
    console.log('🧹 Clearing database...');

    // Delete in reverse order of dependencies
    await sql`DELETE FROM audit_logs`;
    await sql`DELETE FROM generations`;
    await sql`DELETE FROM user_usage`;
    await sql`DELETE FROM quotas`;
    await sql`DELETE FROM users WHERE id = 'test-user-id-12345'`; // Only delete test user

    console.log('✅ Database cleared successfully');
  } catch (error) {
    console.error('❌ Database clearing failed:', error);
    throw error;
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'clear') {
  clearDatabase()
    .then(() => {
      console.log('🎉 Database clear completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database clear failed:', error);
      process.exit(1);
    });
} else {
  // Default action is to seed
  seedDatabase()
    .then(() => {
      console.log('🎉 Database seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database seeding failed:', error);
      process.exit(1);
    });
}