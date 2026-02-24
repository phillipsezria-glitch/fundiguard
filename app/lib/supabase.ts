/**
 * Supabase client initialization & type-safe DB queries
 * TODO: Add .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

// Types for database schema
export interface User {
  id: string;
  phone: string;
  email?: string;
  name: string;
  role: "client" | "pro" | "admin";
  verified: boolean;
  createdAt: Date;
}

export interface Job {
  id: string;
  clientId: string;
  title: string;
  category: string;
  description: string;
  location: { lat: number; lng: number };
  budget: number;
  status: "open" | "assigned" | "in_progress" | "completed" | "disputed";
  createdAt: Date;
}

export interface Bid {
  id: string;
  jobId: string;
  proId: string;
  price: number;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

export interface Rating {
  id: string;
  jobId: string;
  fromUserId: string;
  toUserId: string;
  score: number;
  comment?: string;
  photos?: string[];
  createdAt: Date;
}

// TODO: Initialize Supabase client
// import { createClient } from "@supabase/supabase-js";
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

export const supabaseSchema = `
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'pro', 'admin')),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  location JSONB NOT NULL, -- {lat, lng}
  budget DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'open',
  photos TEXT[], -- URLs
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bids table
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id),
  pro_id UUID NOT NULL REFERENCES users(id),
  price DECIMAL(10,2) NOT NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id),
  from_user_id UUID NOT NULL REFERENCES users(id),
  to_user_id UUID NOT NULL REFERENCES users(id),
  score INT CHECK (score >= 1 AND score <= 5),
  comment TEXT,
  photos TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
`;

export function initSupabase() {
  // TODO: Implement when Supabase URL & key are added
  console.log("Supabase schema defined. Add NEXT_PUBLIC_SUPABASE_URL to .env.local");
}
