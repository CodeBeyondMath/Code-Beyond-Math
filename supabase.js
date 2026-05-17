// Replace with your Supabase project credentials from https://app.supabase.com → Settings → API
const SUPABASE_URL     = 'https://rdveirihuyzhoxcmopsk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3Uiwf6PXBRNAyqaA6LC0MQ_0E3o7Vfc';

window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/*
 * Supabase table required (run in SQL Editor):
 *
CREATE TABLE submissions (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid REFERENCES auth.users(id),
  problem_id    text NOT NULL,
  language_id   integer NOT NULL,
  language_name text NOT NULL,
  source_code   text NOT NULL,
  judge0_token  text,
  status        text DEFAULT 'Processing',
  stdout        text,
  stderr        text,
  time_ms       real,
  memory_kb     integer,
  created_at    timestamptz DEFAULT now()
);
 *
 * ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
 *
 * -- Oricine (inclusiv utilizatori neautentificați) poate citi soluțiile publice
 * CREATE POLICY "public_read" ON submissions FOR SELECT USING (true);
 *
 * -- Doar utilizatorii autentificați pot trimite sau modifica propriile soluții
 * CREATE POLICY "own_insert" ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
 * CREATE POLICY "own_update" ON submissions FOR UPDATE USING (auth.uid() = user_id);
 *
 * -- Dacă ai politici vechi, șterge-le mai întâi:
 * -- DROP POLICY IF EXISTS "own_select" ON submissions;
 * -- DROP POLICY IF EXISTS "public_read" ON submissions;
 */
