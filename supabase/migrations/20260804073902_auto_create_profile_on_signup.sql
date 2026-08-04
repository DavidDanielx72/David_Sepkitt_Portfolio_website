/*
# Auto-create profile on user signup

When a new user registers via Supabase Auth, this trigger automatically
creates a matching row in the `profiles` table with is_site_admin = false.

## 1. New Objects
- Function `handle_new_user()` — inserts a profile row for the new auth user
- Trigger `on_auth_user_created` — fires after INSERT on auth.users

## 2. Security
- The function runs as SECURITY DEFINER (owner) so it can write to profiles
  even though the new user doesn't yet have an authenticated session.
- New profiles default to is_site_admin = false.
- To grant admin access, manually set is_site_admin = true in the Supabase
  dashboard for the desired user.

## 3. Notes
1. After creating an account, you must set is_site_admin = true in the
   Supabase dashboard (Table Editor > profiles) to gain admin editing rights.
*/
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, is_site_admin)
  VALUES (NEW.id, false)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
