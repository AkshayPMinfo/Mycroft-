-- Create projects table
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  status TEXT NOT NULL,
  status_label TEXT NOT NULL,
  deployment TEXT NOT NULL,
  activity TEXT NOT NULL,
  open_bugs INTEGER DEFAULT 0,
  recommendation TEXT,
  updated TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  accent TEXT NOT NULL,
  stack TEXT[]
);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  code TEXT,
  diff JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create system_metrics table
CREATE TABLE system_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  detail TEXT NOT NULL,
  status TEXT NOT NULL,
  icon TEXT NOT NULL
);

-- Note: We will migrate other tables like 'debug_issues', 'memory_entries', 'commits' iteratively
-- as outlined in the phased transition approach.
