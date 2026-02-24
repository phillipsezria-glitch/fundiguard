// Seed/Test Data for Local Development
// Run with: npm run seed

import { supabase } from './src/config/supabase';
import * as bcrypt from 'bcryptjs';

const TEST_USERS = [
  {
    phone_number: '+254712345678',
    password: 'Test@1234',
    full_name: 'Grace Wanjiru',
    role: 'client',
    description: 'Client - The job poster. Use this to post jobs and manage bids.'
  },
  {
    phone_number: '+254722987654',
    password: 'Test@1234',
    full_name: 'James Mwangi',
    role: 'pro',
    description: 'Professional - The fundi. Use this to browse jobs and submit bids.'
  },
  {
    phone_number: '+254733555555',
    password: 'Test@1234',
    full_name: 'Peter Njoroge',
    role: 'pro',
    description: 'Professional #2 - Another fundi for testing multiple bids.'
  },
  {
    phone_number: '+254745777777',
    password: 'Test@1234',
    full_name: 'Mercy Achieng',
    role: 'pro',
    description: 'Professional #3 - Third fundi for bid comparison testing.'
  },
];

async function seedUsers() {
  console.log('🌱 Starting seed process...\n');

  try {
    const saltRounds = 10;

    for (const user of TEST_USERS) {
      // Check if user already exists
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('phone_number', user.phone_number)
        .single();

      if (existing) {
        console.log(`⏭️  User ${user.phone_number} (${user.full_name}) already exists. Skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

      // Insert user
      const { data: _createdUser, error } = await supabase
        .from('users')
        .insert([
          {
            phone_number: user.phone_number,
            password_hash: hashedPassword,
            full_name: user.full_name,
            role: user.role,
            created_at: new Date().toISOString(),
          }
        ])
        .select();

      if (error) {
        console.error(`❌ Error creating user ${user.phone_number}:`, error.message);
      } else {
        console.log(`✅ Created ${user.role.toUpperCase()}: ${user.phone_number}`);
        console.log(`   Name: ${user.full_name}`);
        console.log(`   Password: ${user.password}`);
        console.log(`   ${user.description}\n`);
      }
    }

    console.log('✨ Seed complete!\n');
    console.log('📌 TEST USER CREDENTIALS:\n');
    TEST_USERS.forEach(user => {
      console.log(`${user.role.toUpperCase()} | Phone: ${user.phone_number} | Password: ${user.password} | ${user.full_name}`);
    });
    console.log('\nℹ️  Use these credentials to login locally on http://localhost:3000/auth');

  } catch (error) {
    console.error('Fatal error during seed:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run the seed
seedUsers();
