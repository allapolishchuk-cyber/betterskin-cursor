-- Supabase Database Schema for BetterSkin
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY,
    profile_data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create routines table
CREATE TABLE IF NOT EXISTS routines (
    user_id TEXT PRIMARY KEY,
    routines_data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
    user_id TEXT PRIMARY KEY,
    schedule_data JSONB NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_routines_user_id ON routines(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON schedules(user_id);

-- Enable Row Level Security (RLS) - Optional but recommended
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Create policies to allow users to read/write their own data
-- Note: Since we're using a simple user_id system, we'll allow all operations
-- For production, you should implement proper authentication

CREATE POLICY "Users can read their own profiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profiles" ON profiles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own profiles" ON profiles
    FOR UPDATE USING (true);

CREATE POLICY "Users can read their own routines" ON routines
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own routines" ON routines
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own routines" ON routines
    FOR UPDATE USING (true);

CREATE POLICY "Users can read their own schedules" ON schedules
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own schedules" ON schedules
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own schedules" ON schedules
    FOR UPDATE USING (true);


