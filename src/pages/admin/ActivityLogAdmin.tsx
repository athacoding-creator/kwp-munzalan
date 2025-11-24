import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Filter, Home } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminLogs } from "@/hooks/useAdminLogs";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityLogAdmin() {
  const [filterAction, setFilterAction] = useState<string>("ALL");
  const [filterTable, setFilterTable] = useState<string>("ALL");
  const navigate = useNavigate();
  const { data: logs = [], isLoading, refetch } = useAdminLogs();

  const getActionBadge = (action: string) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      CREATE: "default",
      UPDATE: "secondary",
      DELETE: "destructive",
      LOGIN: "outline",
      LOGOUT: "outline",
    };
    return <Badge variant={variants[action] || "outline"}>{action}</Badge>;
  };

  const filteredLogs = logs.filter((log) => {
    if (filterAction !== "ALL" && log.action !== filterAction) return false;
    if (filterTable !== "ALL" && log.table_name !== filterTable) return false;
    return true;
  });

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));
  const uniqueTables = Array.from(new Set(logs.map((log) => log.table_name)));

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
              <h1 className="text-base sm:text-lg md:text-2xl font-bold truncate">Log Aktivitas</h1>
            </div>
            <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={() => navigate("/")} className="h-8 sm:h-9 px-2 sm:px-3">
                <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Website</span>
              </Button>
              <Button onClick={() => refetch()} disabled={isLoading} size="sm" className="h-8 sm:h-9 px-2 sm:px-3">
                <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2 ${isLoading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <Card className="mb-4 sm:mb-6 shadow-soft border">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              Filter Log
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Filter log berdasarkan action dan tabel</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Pilih Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Action</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterTable} onValueChange={setFilterTable}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Pilih Tabel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Tabel</SelectItem>
                {uniqueTables.map((table) => (
                  <SelectItem key={table} value={table}>
                    {table}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="shadow-soft border">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-base sm:text-lg">Riwayat Aktivitas ({filteredLogs.length} log)</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Menampilkan 100 log aktivitas terakhir
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-4 p-4 sm:p-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-xs sm:text-sm text-muted-foreground">
                Belum ada log aktivitas
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap text-xs sm:text-sm">Waktu</TableHead>
                      <TableHead className="whitespace-nowrap text-xs sm:text-sm">Admin</TableHead>
                      <TableHead className="whitespace-nowrap text-xs sm:text-sm">Action</TableHead>
                      <TableHead className="whitespace-nowrap text-xs sm:text-sm">Tabel</TableHead>
                      <TableHead className="whitespace-nowrap text-xs sm:text-sm">Deskripsi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs whitespace-nowrap">
                          {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss")}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm whitespace-nowrap">{log.user_email}</TableCell>
                        <TableCell className="text-xs sm:text-sm">{getActionBadge(log.action)}</TableCell>
                        <TableCell>
                          <code className="bg-muted px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs whitespace-nowrap">
                            {log.table_name}
                          </code>
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm max-w-[200px] sm:max-w-md truncate">
                          {log.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
