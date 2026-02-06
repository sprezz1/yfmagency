-- Supabase Schema for YFM Agency Applications
-- Run this in Supabase SQL Editor to create the applications table

-- Drop existing table if you need to recreate (CAREFUL: this deletes data!)
-- DROP TABLE IF EXISTS applications;

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  nationality TEXT NOT NULL,
  country_of_residence TEXT NOT NULL,
  discord_username TEXT NOT NULL,
  phone_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Optional: track if they've been contacted
  contacted BOOLEAN DEFAULT FALSE,
  contacted_at TIMESTAMPTZ,
  notes TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);

-- Enable Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for the public form)
CREATE POLICY "Allow anonymous inserts" ON applications
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated users can read (for admin dashboard later)
CREATE POLICY "Authenticated users can read" ON applications
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Optional: Create a view for easy admin access
CREATE OR REPLACE VIEW applications_summary AS
SELECT
  id,
  name,
  email,
  nationality,
  country_of_residence,
  discord_username,
  phone_type,
  created_at,
  contacted,
  DATE(created_at) as application_date
FROM applications
ORDER BY created_at DESC;
