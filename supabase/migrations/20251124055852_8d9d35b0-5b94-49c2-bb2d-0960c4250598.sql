-- Create admin activity logs table
CREATE TABLE public.admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email text NOT NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id text,
  old_data jsonb,
  new_data jsonb,
  description text NOT NULL
);

-- Enable RLS
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Only authenticated users (admins) can view logs
CREATE POLICY "Authenticated users can view admin logs"
ON public.admin_logs
FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

-- Create index for better query performance
CREATE INDEX idx_admin_logs_created_at ON public.admin_logs(created_at DESC);
CREATE INDEX idx_admin_logs_user_id ON public.admin_logs(user_id);
CREATE INDEX idx_admin_logs_table_name ON public.admin_logs(table_name);