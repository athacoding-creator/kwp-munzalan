import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, Filter, Home } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminLogs } from "@/hooks/useAdminLogs";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityLogAdmin() {
  const [filterAction, setFilterAction] = useState<string>("ALL");
  const [filterTable, setFilterTable] = useState<string>("ALL");
  const navigate = useNavigate();
  const { isLoading: authLoading, isAuthorized } = useAdminAuth();
  const { data: logs = [], isLoading, refetch } = useAdminLogs();

  if (authLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

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
            <h1 className="text-4xl font-bold">Log Aktivitas Admin</h1>
            <p className="text-muted-foreground mt-2">
              Tracking semua perubahan data yang dilakukan admin
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Log
            </CardTitle>
            <CardDescription>Filter log berdasarkan action dan tabel</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-[200px]">
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
              <SelectTrigger className="w-[200px]">
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

        <Card>
          <CardHeader>
            <CardTitle>Riwayat Aktivitas ({filteredLogs.length} log)</CardTitle>
            <CardDescription>
              Menampilkan 100 log aktivitas terakhir
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Belum ada log aktivitas
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <Table className="min-w-[640px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Waktu</TableHead>
                      <TableHead className="whitespace-nowrap">Admin</TableHead>
                      <TableHead className="whitespace-nowrap">Action</TableHead>
                      <TableHead className="whitespace-nowrap">Tabel</TableHead>
                      <TableHead className="whitespace-nowrap">Deskripsi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm whitespace-nowrap">
                          {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss")}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{log.user_email}</TableCell>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell>
                          <code className="bg-muted px-2 py-1 rounded text-sm whitespace-nowrap">
                            {log.table_name}
                          </code>
                        </TableCell>
                        <TableCell className="max-w-md truncate">
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
