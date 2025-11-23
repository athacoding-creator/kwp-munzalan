import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, RefreshCw, Image as ImageIcon } from "lucide-react";

interface MediaFile {
  name: string;
  id: string;
  created_at: string;
  metadata: Record<string, any>;
}

export default function MediaAdmin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchFiles();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/admin");
  };

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage.from("media").list();
      if (error) throw error;
      setFiles(data || []);
    } catch (error: any) {
      toast({
        title: "Error memuat file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFileSelection = (fileName: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileName)) {
      newSelected.delete(fileName);
    } else {
      newSelected.add(fileName);
    }
    setSelectedFiles(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map((f) => f.name)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) {
      toast({
        title: "Tidak ada file dipilih",
        description: "Pilih file yang ingin dihapus",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Yakin ingin menghapus ${selectedFiles.size} file?`)) return;

    setDeleting(true);
    try {
      const filesToDelete = Array.from(selectedFiles);
      const { error } = await supabase.storage.from("media").remove(filesToDelete);

      if (error) throw error;

      toast({
        title: "Berhasil!",
        description: `${selectedFiles.size} file berhasil dihapus`,
      });

      setSelectedFiles(new Set());
      await fetchFiles();
    } catch (error: any) {
      toast({
        title: "Error menghapus file",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const getFileUrl = (fileName: string) => {
    const { data } = supabase.storage.from("media").getPublicUrl(fileName);
    return data.publicUrl;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <nav className="bg-card border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-2xl font-bold">Kelola Media Storage</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchFiles} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={selectedFiles.size === 0 || deleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus ({selectedFiles.size})
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-soft border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                File Media ({files.length} file
                {files.length > 0 && ` - ${formatFileSize(files.reduce((acc, f) => acc + (f.metadata?.size || 0), 0))} total`})
              </CardTitle>
              {files.length > 0 && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedFiles.size === files.length}
                    onCheckedChange={toggleSelectAll}
                  />
                  <label className="text-sm text-muted-foreground">Pilih Semua</label>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Memuat file...</p>
            ) : files.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Belum ada file yang diupload</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => {
                  const isImage = file.metadata?.mimetype?.startsWith("image/");
                  return (
                    <div
                      key={file.name}
                      className={`border rounded-lg p-4 hover:bg-accent/50 transition-colors ${
                        selectedFiles.has(file.name) ? "bg-accent border-primary" : "bg-card"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedFiles.has(file.name)}
                          onCheckedChange={() => toggleFileSelection(file.name)}
                        />
                        <div className="flex-1 min-w-0">
                          {isImage ? (
                            <img
                              src={getFileUrl(file.name)}
                              alt={file.name}
                              className="w-full h-32 object-cover rounded mb-2"
                            />
                          ) : (
                            <div className="w-full h-32 bg-muted rounded mb-2 flex items-center justify-center">
                              <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          <p className="text-sm font-medium truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.metadata?.size || 0)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(file.created_at).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
