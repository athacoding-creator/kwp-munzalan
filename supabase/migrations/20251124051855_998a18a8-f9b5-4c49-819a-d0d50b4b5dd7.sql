-- Create table for keep-alive logs
CREATE TABLE IF NOT EXISTS public.keep_alive_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL,
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.keep_alive_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view logs
CREATE POLICY "Authenticated users can view keep-alive logs"
ON public.keep_alive_logs
FOR SELECT
USING (auth.role() = 'authenticated'::text);

-- Create index for faster queries
CREATE INDEX idx_keep_alive_logs_timestamp ON public.keep_alive_logs(timestamp DESC);