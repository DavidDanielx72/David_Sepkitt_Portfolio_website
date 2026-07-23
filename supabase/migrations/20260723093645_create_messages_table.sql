/*
# Create messages table for contact form

1. New Tables
- `messages` — stores contact form submissions from the portfolio website.
  - `id` (uuid, primary key)
  - `name` (text, not null) — sender's name, max 200 chars enforced by edge function
  - `email` (text, not null) — sender's email, max 200 chars
  - `message` (text, not null) — message body, max 5000 chars
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `messages`.
- INSERT only for anon + authenticated (the public contact form needs to submit without sign-in).
- No SELECT/UPDATE/DELETE for anon — only the service role (used by the edge function) can read messages.
  This prevents anyone from scraping submitted messages via the anon key.
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public insert (contact form has no sign-in)
DROP POLICY IF EXISTS "anon_insert_messages" ON messages;
CREATE POLICY "anon_insert_messages" ON messages FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- No SELECT/UPDATE/DELETE for anon — service role bypasses RLS to read submissions
