/*
# Create messages table for portfolio contact form

## Purpose
Stores messages submitted by visitors through the contact form on David Sepkitt's
portfolio website. Each row represents one inbound enquiry from a potential employer
or collaborator.

## 1. New Tables
- `messages`
  - `id` (uuid, primary key) — unique message identifier
  - `name` (text, not null) — sender's name
  - `email` (text, not null) — sender's reply-to email address
  - `message` (text, not null) — the message body
  - `is_read` (boolean, default false) — flag for tracking read/unread state
  - `created_at` (timestamptz, default now()) — submission timestamp

## 2. Security
- RLS enabled on `messages`.
- INSERT is allowed for `anon, authenticated` (public visitors can submit the form
  without signing in). SELECT/UPDATE/DELETE are restricted to `authenticated` so
  only the portfolio owner (signed in via Supabase dashboard) can read or manage
  messages. This is intentionally a public-submission / private-read pattern.

## 3. Notes
1. The frontend uses the anon key, so INSERT must be open to `anon`.
2. No `user_id` column — this is a single-tenant contact form, not per-user data.
3. No indexes needed at this scale; `created_at` ordering is sufficient.
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public can insert messages (contact form submission)
DROP POLICY IF EXISTS "anon_insert_messages" ON messages;
CREATE POLICY "anon_insert_messages"
ON messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated (portfolio owner) can read messages
DROP POLICY IF EXISTS "auth_select_messages" ON messages;
CREATE POLICY "auth_select_messages"
ON messages FOR SELECT
TO authenticated
USING (true);

-- Only authenticated can mark messages read
DROP POLICY IF EXISTS "auth_update_messages" ON messages;
CREATE POLICY "auth_update_messages"
ON messages FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

-- Only authenticated can delete messages
DROP POLICY IF EXISTS "auth_delete_messages" ON messages;
CREATE POLICY "auth_delete_messages"
ON messages FOR DELETE
TO authenticated
USING (true);
