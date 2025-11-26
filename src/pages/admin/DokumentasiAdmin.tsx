import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Pencil, Trash2, Home } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { logAdminActivity } from "@/lib/adminLogger";

interface DokumentasiData {
  id: string;
  jenis_media: string;
  media_url: string;
  deskripsi: string | null;
  kegiatan_id: string | null;
  kegiatan?: {
    nama_kegiatan: string;
  };
}

interface KegiatanOption {
  id: string;
  nama_kegiatan: string;
}

export default function DokumentasiAdmin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dokumentasi, setDokumentasi] = useState<DokumentasiData[]>([]);
  const [kegiatanOptions, setKegiatanOptions] = useState<KegiatanOption[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    jenis_media: "foto",
    media_url: "",
    deskripsi: "",
    kegiatan_id: "NONE",
  });

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/admin");
  };

  const fetchData = async () => {
    const { data: docData } = await supabase
      .from("dokumentasi")
      .select(`*, kegiatan:kegiatan_id(nama_kegiatan)`);
    if (docData) setDokumentasi(docData);

    const { data: kegiatanData } = await supabase.from("kegiatan").select("id, nama_kegiatan");
    if (kegiatanData) setKegiatanOptions(kegiatanData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        kegiatan_id: formData.kegiatan_id === "NONE" ? null : formData.kegiatan_id,
      };

      if (editingId) {
        const oldData = dokumentasi.find(d => d.id === editingId);
        const { error } = await supabase
          .from("dokumentasi")
          .update(dataToSubmit)
          .eq("id", editingId);
        if (error) throw error;
        
        await logAdminActivity({
          action: "UPDATE",
          tableName: "dokumentasi",
          recordId: editingId,
          oldData,
          newData: dataToSubmit,
          description: `Update dokumentasi: ${formData.jenis_media}`,
        });
        
        toast({ title: "Dokumentasi berhasil diupdate!" });
      } else {
        const { data, error } = await supabase.from("dokumentasi").insert([dataToSubmit]).select();
        if (error) throw error;
        
        await logAdminActivity({
          action: "CREATE",
          tableName: "dokumentasi",
          recordId: data?.[0]?.id,
          newData: dataToSubmit,
          description: `Tambah dokumentasi baru: ${formData.jenis_media}`,
        });
        
        toast({ title: "Dokumentasi berhasil ditambahkan!" });
      }
      setFormData({ jenis_media: "foto", media_url: "", deskripsi: "", kegiatan_id: "NONE" });
      setIsEditing(false);
      setEditingId(null);
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (item: DokumentasiData) => {
    setFormData({
      jenis_media: item.jenis_media,
      media_url: item.media_url,
      deskripsi: item.deskripsi || "",
      kegiatan_id: item.kegiatan_id || "NONE",
    });
    setEditingId(item.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      const deletedItem = dokumentasi.find(d => d.id === id);
      const { error } = await supabase.from("dokumentasi").delete().eq("id", id);
      if (error) throw error;
      
      await logAdminActivity({
        action: "DELETE",
        tableName: "dokumentasi",
        recordId: id,
        oldData: deletedItem,
        description: `Hapus dokumentasi: ${deletedItem?.jenis_media}`,
      });
      
      toast({ title: "Dokumentasi berhasil dihapus!" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
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
              <h1 className="text-base sm:text-lg md:text-2xl font-bold truncate">Kelola Dokumentasi</h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate("/")} className="h-8 sm:h-9 px-2 sm:px-3 flex-shrink-0">
              <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">Website</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <Card className="shadow-soft border hover:shadow-elegant transition-smooth">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg">{isEditing ? "Edit Dokumentasi" : "Tambah Dokumentasi Baru"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="jenis_media">Jenis Media</Label>
                  <Select
                    value={formData.jenis_media}
                    onValueChange={(value) => setFormData({ ...formData, jenis_media: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="foto">Foto</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="kegiatan_id">Kegiatan (Opsional)</Label>
                  <Select
                    value={formData.kegiatan_id}
                    onValueChange={(value) => setFormData({ ...formData, kegiatan_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kegiatan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">Tidak ada</SelectItem>
                      {kegiatanOptions.map((kegiatan) => (
                        <SelectItem key={kegiatan.id} value={kegiatan.id}>
                          {kegiatan.nama_kegiatan}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FileUpload
                  label="Upload Media"
                  currentUrl={formData.media_url}
                  onUploadComplete={(url) => setFormData({ ...formData, media_url: url })}
                  accept={formData.jenis_media === "video" ? "video/*" : "image/*"}
                />
                <div>
                  <Label htmlFor="deskripsi">Deskripsi (Opsional)</Label>
                  <Textarea
                    id="deskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="submit" className="gradient-primary text-primary-foreground w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    {isEditing ? "Update" : "Tambah"}
                  </Button>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        setIsEditing(false);
                        setEditingId(null);
                        setFormData({ jenis_media: "foto", media_url: "", deskripsi: "", kegiatan_id: "" });
                      }}
                    >
                      Batal
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-3 sm:space-y-4">
            {dokumentasi.map((item) => (
              <Card key={item.id} className="shadow-soft border hover:shadow-elegant transition-smooth">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex gap-3 sm:gap-4">
                    {item.jenis_media === "foto" ? (
                      <img src={item.media_url} alt="" className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain rounded flex-shrink-0" />
                    ) : (
                      <video src={item.media_url} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain rounded bg-black flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-primary mb-1 capitalize">{item.jenis_media}</p>
                      {item.kegiatan && (
                        <p className="text-xs sm:text-sm font-medium mb-1 truncate">{item.kegiatan.nama_kegiatan}</p>
                      )}
                      {item.deskripsi && (
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">{item.deskripsi}</p>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="h-7 sm:h-8 px-2 sm:px-3">
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)} className="h-7 sm:h-8 px-2 sm:px-3">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
