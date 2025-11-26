import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Trash2, RefreshCw, Image as ImageIcon, Home } from "lucide-react";

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
    <div className="min-h-screen bg-muted/30 overflow-x-hidden">
      <nav className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")} className="h-8 sm:h-9 px-2 sm:px-3 flex-shrink-0">
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Kembali</span>
              </Button>
              <h1 className="text-base sm:text-lg md:text-2xl font-bold truncate">Media Storage</h1>
            </div>
            <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={fetchFiles} disabled={loading} className="h-8 sm:h-9 px-2 sm:px-3">
                <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              {selectedFiles.size > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDelete}
                  disabled={deleting}
                  className="h-8 sm:h-9 px-2 sm:px-3"
                >
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden xs:inline">Hapus</span> ({selectedFiles.size})
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => navigate("/")} className="h-8 sm:h-9 px-2 sm:px-3">
                <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Website</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <Card className="shadow-soft border">
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="text-base sm:text-lg">
                File Media ({files.length} file
                {files.length > 0 && ` - ${formatFileSize(files.reduce((acc, f) => acc + (f.metadata?.size || 0), 0))} total`})
              </CardTitle>
              {files.length > 0 && (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedFiles.size === files.length}
                    onCheckedChange={toggleSelectAll}
                  />
                  <label className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Pilih Semua</label>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-8 text-xs sm:text-sm text-muted-foreground">Memuat file...</p>
            ) : files.length === 0 ? (
              <p className="text-center py-8 text-xs sm:text-sm text-muted-foreground">Belum ada file yang diupload</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {files.map((file) => {
                  const isImage = file.metadata?.mimetype?.startsWith("image/");
                  return (
                    <div
                      key={file.name}
                      className={`border rounded-lg overflow-hidden transition-all hover:shadow-md ${
                        selectedFiles.has(file.name) ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <div className="p-2 sm:p-3">
                        <Checkbox
                          checked={selectedFiles.has(file.name)}
                          onCheckedChange={() => toggleFileSelection(file.name)}
                          className="mb-2"
                        />
                        {isImage ? (
                          <img
                            src={getFileUrl(file.name)}
                            alt={file.name}
                            className="w-full object-contain rounded mb-2"
                          />
                        ) : (
                          <div className="w-full h-24 sm:h-32 bg-muted rounded mb-2 flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground" />
                          </div>
                        )}
                        <p className="text-xs font-medium truncate" title={file.name}>
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
