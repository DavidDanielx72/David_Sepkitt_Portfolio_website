/*
# Create projects, certificates, and profiles tables with admin-only editing

## Overview
This migration adds three new tables for dynamic content management:
- profiles — tracks site admins
- projects — portfolio projects
- certificates — certificates with file uploads

A private storage bucket 'certificates' is created for certificate files.

## 1. New Tables
### profiles
- id (uuid PK, references auth.users)
- is_site_admin (boolean, default false)
- created_at (timestamptz)

### projects
- id (uuid PK)
- title (text, not null)
- tag (text) — category label
- icon (text) — icon name
- stack (text[]) — tech stack
- description (text, not null)
- link (text, not null) — GitHub or site URL
- demo (text) — optional live demo URL
- sort_order (int, default 0)
- created_at (timestamptz)

### certificates
- id (uuid PK)
- title (text, not null)
- issuer (text)
- file_path (text) — storage path
- file_url (text) — URL to file
- sort_order (int, default 0)
- created_at (timestamptz)

## 2. Storage
- Private bucket 'certificates' with public read, authenticated write.

## 3. Security
- profiles: own-read only
- projects: public read, admin-only write
- certificates: public read, admin-only write
- is_site_admin() SECURITY DEFINER function checks admin status

## 4. Notes
1. Set yourself as admin by inserting into profiles with is_site_admin = true.
2. Certificate files use signed URLs for viewing.
*/
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_site_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  tag text,
  icon text DEFAULT 'sparkles',
  stack text[] DEFAULT '{}',
  description text NOT NULL,
  link text NOT NULL,
  demo text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_select_public" ON projects;
CREATE POLICY "projects_select_public" ON projects FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text,
  file_path text,
  file_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "certificates_select_public" ON certificates;
CREATE POLICY "certificates_select_public" ON certificates FOR SELECT
  TO anon, authenticated USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "cert_bucket_read" ON storage.objects;
CREATE POLICY "cert_bucket_read" ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'certificates');

DROP POLICY IF EXISTS "cert_bucket_write" ON storage.objects;
CREATE POLICY "cert_bucket_write" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'certificates');

DROP POLICY IF EXISTS "cert_bucket_update" ON storage.objects;
CREATE POLICY "cert_bucket_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'certificates');

DROP POLICY IF EXISTS "cert_bucket_delete" ON storage.objects;
CREATE POLICY "cert_bucket_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'certificates');

CREATE OR REPLACE FUNCTION is_site_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_site_admin FROM profiles WHERE id = auth.uid()),
    false
  );
$$;

REVOKE EXECUTE ON FUNCTION is_site_admin() FROM anon;
GRANT EXECUTE ON FUNCTION is_site_admin() TO authenticated;

DROP POLICY IF EXISTS "projects_insert_admin" ON projects;
CREATE POLICY "projects_insert_admin" ON projects FOR INSERT
  TO authenticated WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "projects_update_admin" ON projects;
CREATE POLICY "projects_update_admin" ON projects FOR UPDATE
  TO authenticated USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "projects_delete_admin" ON projects;
CREATE POLICY "projects_delete_admin" ON projects FOR DELETE
  TO authenticated USING (is_site_admin());

DROP POLICY IF EXISTS "certificates_insert_admin" ON certificates;
CREATE POLICY "certificates_insert_admin" ON certificates FOR INSERT
  TO authenticated WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "certificates_update_admin" ON certificates;
CREATE POLICY "certificates_update_admin" ON certificates FOR UPDATE
  TO authenticated USING (is_site_admin()) WITH CHECK (is_site_admin());

DROP POLICY IF EXISTS "certificates_delete_admin" ON certificates;
CREATE POLICY "certificates_delete_admin" ON certificates FOR DELETE
  TO authenticated USING (is_site_admin());
