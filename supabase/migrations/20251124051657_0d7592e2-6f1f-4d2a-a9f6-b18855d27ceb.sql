-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the keep-alive function to run every 12 hours
SELECT cron.schedule(
  'keep-database-alive',
  '0 */12 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://lsraodwvsklfoyblohsj.supabase.co/functions/v1/keep-alive',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzcmFvZHd2c2tsZm95YmxvaHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MDM2MDYsImV4cCI6MjA3OTQ3OTYwNn0.xHDyPmTY158VSVIYecvBCg5BVQRJ0sspROdKzAk7DaY"}'::jsonb,
        body:=concat('{"time": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);