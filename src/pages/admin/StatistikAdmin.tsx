import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, TrendingUp, Activity, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminLog {
  id: string;
  created_at: string;
  action: string;
  table_name: string;
}

interface DailyActivity {
  date: string;
  count: number;
}

interface ActionStats {
  action: string;
  count: number;
}

interface TableStats {
  table: string;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function StatistikAdmin() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7' | '30'>('7');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchLogs();
  }, [timeRange]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin");
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const daysAgo = parseInt(timeRange);
      const startDate = startOfDay(subDays(new Date(), daysAgo));

      const { data, error } = await supabase
        .from("admin_logs")
        .select("id, created_at, action, table_name")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: true });

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

  const getDailyActivity = (): DailyActivity[] => {
    const daysAgo = parseInt(timeRange);
    const dateMap = new Map<string, number>();

    // Initialize all dates with 0
    for (let i = daysAgo - 1; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'dd/MM');
      dateMap.set(date, 0);
    }

    // Count activities per day
    logs.forEach(log => {
      const date = format(new Date(log.created_at), 'dd/MM');
      dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });

    return Array.from(dateMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  };

  const getActionStats = (): ActionStats[] => {
    const actionMap = new Map<string, number>();

    logs.forEach(log => {
      actionMap.set(log.action, (actionMap.get(log.action) || 0) + 1);
    });

    return Array.from(actionMap.entries())
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getTableStats = (): TableStats[] => {
    const tableMap = new Map<string, number>();

    logs.forEach(log => {
      tableMap.set(log.table_name, (tableMap.get(log.table_name) || 0) + 1);
    });

    return Array.from(tableMap.entries())
      .map(([table, count]) => ({ table, count }))
      .sort((a, b) => b.count - a.count);
  };

  const dailyActivity = getDailyActivity();
  const actionStats = getActionStats();
  const tableStats = getTableStats();
  const totalActivities = logs.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Dashboard
            </Button>
            <h1 className="text-4xl font-bold">Statistik Aktivitas Admin</h1>
            <p className="text-muted-foreground mt-2">
              Analisis aktivitas admin dalam periode waktu tertentu
            </p>
          </div>
          <Button onClick={fetchLogs} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as '7' | '30')}>
          <TabsList>
            <TabsTrigger value="7">7 Hari Terakhir</TabsTrigger>
            <TabsTrigger value="30">30 Hari Terakhir</TabsTrigger>
          </TabsList>

          <TabsContent value={timeRange} className="space-y-6 mt-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Aktivitas</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalActivities}</div>
                  <p className="text-xs text-muted-foreground">
                    dalam {timeRange} hari terakhir
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rata-rata Harian</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(totalActivities / parseInt(timeRange)).toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    aktivitas per hari
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tabel Tersering</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {tableStats[0]?.table || '-'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tableStats[0]?.count || 0} perubahan
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Daily Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Aktivitas Harian</CardTitle>
                <CardDescription>
                  Grafik aktivitas admin per hari
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Memuat data...</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="Jumlah Aktivitas"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Action Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribusi Tipe Aktivitas</CardTitle>
                  <CardDescription>
                    Breakdown aktivitas berdasarkan action
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Memuat data...</div>
                  ) : actionStats.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Belum ada data
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={actionStats}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.action}: ${entry.count}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {actionStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Aktivitas per Tabel</CardTitle>
                  <CardDescription>
                    Tabel yang paling sering dimodifikasi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Memuat data...</div>
                  ) : tableStats.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Belum ada data
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={tableStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="table" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#82ca9d" name="Jumlah Aktivitas" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
