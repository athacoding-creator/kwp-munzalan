import { supabase } from "@/integrations/supabase/client";

type LogAction = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";

interface LogParams {
  action: LogAction;
  tableName: string;
  recordId?: string;
  oldData?: any;
  newData?: any;
  description: string;
}

export async function logAdminActivity({
  action,
  tableName,
  recordId,
  oldData,
  newData,
  description,
}: LogParams) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("No user found for logging");
      return;
    }

    const { error } = await supabase.from("admin_logs").insert({
      user_id: user.id,
      user_email: user.email || "unknown",
      action,
      table_name: tableName,
      record_id: recordId,
      old_data: oldData,
      new_data: newData,
      description,
    });

    if (error) {
      console.error("Error logging admin activity:", error);
    }
  } catch (error) {
    console.error("Error in logAdminActivity:", error);
  }
}
