/*
  # Create registrations table

  1. New Tables
    - `registrations`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `gender` (text)
      - `college` (text)
      - `department` (text)
      - `year` (text)
      - `student_id` (text)
      - `events_interested` (text[])
      - `t_shirt_size` (text)
      - `dietary_restrictions` (text[])
      - `special_requirements` (text)
      - `hear_about_us` (text)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `registrations` table
    - Add policies for:
      - Users can read their own registrations
      - Users can create their own registrations
*/

CREATE TABLE registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text NOT NULL,
  gender text NOT NULL,
  college text NOT NULL,
  department text NOT NULL,
  year text NOT NULL,
  student_id text NOT NULL,
  events_interested text[] NOT NULL DEFAULT '{}',
  t_shirt_size text NOT NULL,
  dietary_restrictions text[] NOT NULL DEFAULT '{}',
  special_requirements text,
  hear_about_us text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own registrations"
  ON registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);