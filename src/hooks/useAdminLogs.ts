import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdminLog {
  id: string;
  created_at: string;
  user_email: string;
  action: string;
  table_name: string;
  record_id: string | null;
  description: string;
  old_data: any;
  new_data: any;
}

export function useAdminLogs(limit: number = 100) {
  return useQuery({
    queryKey: ['admin-logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as AdminLog[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for logs (more frequent updates)
  });
}

export function useAdminLogStats(timeRange: '7' | '30') {
  return useQuery({
    queryKey: ['admin-log-stats', timeRange],
    queryFn: async () => {
      const daysAgo = parseInt(timeRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      startDate.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("admin_logs")
        .select("id, created_at, action, table_name")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes for stats
  });
}
