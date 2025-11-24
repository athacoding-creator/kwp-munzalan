import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, RefreshCw, TrendingUp, Activity, Calendar, Home } from "lucide-react";
import { format, subDays } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminLogStats } from "@/hooks/useAdminLogs";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [timeRange, setTimeRange] = useState<'7' | '30'>('7');
  const navigate = useNavigate();
  const { data: logs = [], isLoading, refetch } = useAdminLogStats(timeRange);

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
    <div className="min-h-screen bg-muted/30 overflow-x-hidden">
      <nav className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                onClick={() => navigate("/admin/dashboard")}
                size="sm"
                className="h-8 sm:h-9 px-2 sm:px-3 flex-shrink-0"
              >
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
              <h1 className="text-base sm:text-lg md:text-2xl font-bold truncate">Statistik</h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/")} className="h-8 sm:h-9 px-2 sm:px-3 flex-shrink-0">
              <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Website</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
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
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <Home className="h-4 w-4 mr-2" />
              Ke Website
            </Button>
            <Button onClick={() => refetch()} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
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
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-6 px-6">
                    <ResponsiveContainer width="100%" height={300} minWidth={300}>
                      <LineChart data={dailyActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" style={{ fontSize: '12px' }} />
                        <YAxis style={{ fontSize: '12px' }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Line 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          name="Jumlah Aktivitas"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
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
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-64 w-full" />
                    </div>
                  ) : actionStats.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Belum ada data
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <ResponsiveContainer width="100%" height={300} minWidth={250}>
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
                    </div>
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
                  {isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-64 w-full" />
                    </div>
                  ) : tableStats.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Belum ada data
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <ResponsiveContainer width="100%" height={300} minWidth={250}>
                        <BarChart data={tableStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="table" style={{ fontSize: '12px' }} />
                          <YAxis style={{ fontSize: '12px' }} />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Bar dataKey="count" fill="#82ca9d" name="Jumlah Aktivitas" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
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
