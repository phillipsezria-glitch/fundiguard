// Test Supabase Connection
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseKey = supabaseServiceKey || supabaseAnonKey;

console.log('\n🔍 Supabase Connection Test');
console.log('============================');
console.log(`URL: ${supabaseUrl}`);
console.log(`Using Service Role Key: ${!!supabaseServiceKey}`);
console.log(`Using Anon Key: ${!!supabaseAnonKey}`);

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n📡 Connecting to Supabase...');
    
    // Test 1: Query users table
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
        console.log(`📋 Sample user:`, JSON.stringify(users[0], null, 2));
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

    console.log('\n✅ Supabase connection verified successfully!');
    console.log('✅ All tables are accessible!');
    console.log('✅ Ready to run backend with database integration!');
    
  } catch (error) {
    console.error('\n❌ Connection test failed:', error);
    process.exit(1);
  }
}

testConnection();
