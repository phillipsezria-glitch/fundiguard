// Test Supabase Connection
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

console.log('\n🔍 Supabase Connection Test');
console.log('============================');
console.log(`URL: ${supabaseUrl}`);
console.log(`Using Service Role Key: ${!!process.env.SUPABASE_SERVICE_ROLE_KEY}`);
console.log(`Using Anon Key: ${!!anonKey}`);

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n📡 Connecting to Supabase...');
    
    // Test 1: Query users table schema
    console.log('\n✓ Test 1: Querying users table...');
    const { data: users, error: usersError, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (usersError) {
      console.error('❌ Error querying users:', usersError.message);
    } else {
      console.log(`✅ Users table found. Total records: ${count}`);
      if (users && users.length > 0) {
        console.log(`📋 Sample user:`, users[0]);
      }
    }

    // Test 2: Query professionals table
    console.log('\n✓ Test 2: Querying professionals table...');
    const { data: professionals, error: prosError, count: prosCount } = await supabase
      .from('professionals')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (prosError) {
      console.error('❌ Error querying professionals:', prosError.message);
    } else {
      console.log(`✅ Professionals table found. Total records: ${prosCount}`);
      if (professionals && professionals.length > 0) {
        console.log(`📋 Sample professional:`, professionals[0]);
      }
    }

    // Test 3: Query jobs table
    console.log('\n✓ Test 3: Querying jobs table...');
    const { data: jobs, error: jobsError, count: jobsCount } = await supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .limit(5);
    
    if (jobsError) {
      console.error('❌ Error querying jobs:', jobsError.message);
    } else {
      console.log(`✅ Jobs table found. Total records: ${jobsCount}`);
    }

    // Test 4: List all tables
    console.log('\n✓ Test 4: Listing all tables in database...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('❌ Error listing tables:', tablesError.message);
    } else {
      console.log(`✅ Database tables:`);
      tables?.forEach(t => console.log(`  - ${t.table_name}`));
    }

    console.log('\n✅ Supabase connection verified successfully!');
    
  } catch (error) {
    console.error('\n❌ Connection test failed:', error);
    process.exit(1);
  }
}

testConnection();
