import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);

async function executeSqlFile(filePath: string) {
  try {
    console.log(`Executing SQL file: ${filePath}`);
    const sqlContent = readFileSync(filePath, 'utf8');
    
    // Split statements by semicolon and execute each one
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`Executing statement ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
        try {
          // Use the sql function with no interpolation for static SQL
          const result = await sql.query(statement);
          console.log(`✅ Statement ${i + 1} executed successfully`);
        } catch (stmtError) {
          console.error(`❌ Error in statement ${i + 1}:`, stmtError);
          // Continue with other statements
        }
      }
    }
    
    console.log(`✅ Successfully executed ${filePath}`);
  } catch (error) {
    console.error(`❌ Error executing ${filePath}:`, error);
    throw error;
  }
}

// Get SQL file path from command line arguments
const sqlFilePath = process.argv[2];

if (!sqlFilePath) {
  console.error('Please provide a SQL file path as an argument');
  console.error('Usage: npx tsx scripts/execute-sql.ts <path-to-sql-file>');
  process.exit(1);
}

// Execute the SQL file
executeSqlFile(resolve(process.cwd(), sqlFilePath))
  .then(() => {
    console.log('🎉 SQL execution completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 SQL execution failed:', error);
    process.exit(1);
  });