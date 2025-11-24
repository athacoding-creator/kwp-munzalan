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
    kegiatan_id: "",
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
        kegiatan_id: formData.kegiatan_id || null,
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
      setFormData({ jenis_media: "foto", media_url: "", deskripsi: "", kegiatan_id: "" });
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
      kegiatan_id: item.kegiatan_id || "",
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
    <div className="min-h-screen bg-muted/30">
      <nav className="bg-card border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-2xl font-bold">Kelola Dokumentasi</h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/")}>
            <Home className="h-4 w-4 mr-2" />
            Ke Website
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Dokumentasi" : "Tambah Dokumentasi Baru"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      <SelectItem value="">Tidak ada</SelectItem>
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
                <div className="flex gap-2">
                  <Button type="submit" className="gradient-primary text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    {isEditing ? "Update" : "Tambah"}
                  </Button>
                  {isEditing && (
                    <Button
                      type="button"
                      variant="outline"
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

          <div className="space-y-4">
            {dokumentasi.map((item) => (
              <Card key={item.id} className="shadow-soft border-0">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {item.jenis_media === "foto" ? (
                      <img src={item.media_url} alt="" className="w-24 h-24 object-cover rounded" />
                    ) : (
                      <video src={item.media_url} className="w-24 h-24 object-cover rounded bg-black" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm text-primary mb-1">{item.jenis_media}</p>
                      {item.kegiatan && (
                        <p className="text-sm font-medium mb-1">{item.kegiatan.nama_kegiatan}</p>
                      )}
                      {item.deskripsi && (
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.deskripsi}</p>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
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
