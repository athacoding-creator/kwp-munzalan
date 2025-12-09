import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Activity, CheckCircle2, XCircle, Home, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface KeepAliveLog {
  id: string;
  timestamp: string;
  status: string;
  message: string | null;
  created_at: string;
}

const MonitoringAdmin = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<KeepAliveLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const { toast } = useToast();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("keep_alive_logs")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerKeepAlive = async () => {
    setTriggering(true);
    try {
      const { data, error } = await supabase.functions.invoke("keep-alive");

      if (error) throw error;

      toast({
        title: "Keep-Alive Triggered",
        description: "Database keep-alive ping sent successfully",
      });

      // Refresh logs after a short delay
      setTimeout(fetchLogs, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setTriggering(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const lastLog = logs[0];
  const successRate = logs.length > 0
    ? ((logs.filter(log => log.status === "success").length / logs.length) * 100).toFixed(1)
    : "0";

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/dashboard")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Dashboard
          </Button>
          <h1 className="text-3xl font-bold">Keep-Alive Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Monitor database keep-alive status and history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            <Home className="h-4 w-4 mr-2" />
            Ke Website
          </Button>
          <Button onClick={triggerKeepAlive} disabled={triggering}>
            <Activity className="mr-2 h-4 w-4" />
            {triggering ? "Triggering..." : "Trigger Now"}
          </Button>
          <Button onClick={fetchLogs} variant="outline" disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Status</CardTitle>
            {lastLog?.status === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastLog ? (
                <Badge variant={lastLog.status === "success" ? "default" : "destructive"}>
                  {lastLog.status.toUpperCase()}
                </Badge>
              ) : (
                <span className="text-muted-foreground">No data</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {lastLog ? `Last ping: ${format(new Date(lastLog.timestamp), "PPpp")}` : "No pings yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on last {logs.length} pings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Showing last 50 entries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Keep-Alive Logs</CardTitle>
          <CardDescription>
            History of keep-alive pings to prevent database auto-pause
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading logs...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No logs available yet. Trigger a keep-alive ping to start monitoring.
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {log.status === "success" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">
                        {format(new Date(log.timestamp), "PPpp")}
                      </p>
                      {log.message && (
                        <p className="text-sm text-muted-foreground">{log.message}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={log.status === "success" ? "default" : "destructive"}>
                    {log.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringAdmin;
