import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Pencil, Trash2, Home } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { logAdminActivity } from "@/lib/adminLogger";

interface FasilitasData {
  id: string;
  nama: string;
  deskripsi: string;
  foto_url: string | null;
}

export default function FasilitasAdmin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fasilitas, setFasilitas] = useState<FasilitasData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    foto_url: "",
  });

  useEffect(() => {
    checkAuth();
    fetchFasilitas();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/admin");
  };

  const fetchFasilitas = async () => {
    const { data } = await supabase.from("fasilitas").select("*");
    if (data) setFasilitas(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const oldData = fasilitas.find(f => f.id === editingId);
        const { error } = await supabase
          .from("fasilitas")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
        
        await logAdminActivity({
          action: "UPDATE",
          tableName: "fasilitas",
          recordId: editingId,
          oldData,
          newData: formData,
          description: `Update fasilitas: ${formData.nama}`,
        });
        
        toast({ title: "Fasilitas berhasil diupdate!" });
      } else {
        const { data, error } = await supabase.from("fasilitas").insert([formData]).select();
        if (error) throw error;
        
        await logAdminActivity({
          action: "CREATE",
          tableName: "fasilitas",
          recordId: data?.[0]?.id,
          newData: formData,
          description: `Tambah fasilitas baru: ${formData.nama}`,
        });
        
        toast({ title: "Fasilitas berhasil ditambahkan!" });
      }
      setFormData({ nama: "", deskripsi: "", foto_url: "" });
      setIsEditing(false);
      setEditingId(null);
      fetchFasilitas();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (item: FasilitasData) => {
    setFormData({
      nama: item.nama,
      deskripsi: item.deskripsi,
      foto_url: item.foto_url || "",
    });
    setEditingId(item.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      const deletedItem = fasilitas.find(f => f.id === id);
      const { error } = await supabase.from("fasilitas").delete().eq("id", id);
      if (error) throw error;
      
      await logAdminActivity({
        action: "DELETE",
        tableName: "fasilitas",
        recordId: id,
        oldData: deletedItem,
        description: `Hapus fasilitas: ${deletedItem?.nama}`,
      });
      
      toast({ title: "Fasilitas berhasil dihapus!" });
      fetchFasilitas();
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
              <h1 className="text-base sm:text-lg md:text-2xl font-bold truncate">Kelola Fasilitas</h1>
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
              <CardTitle className="text-base sm:text-lg">{isEditing ? "Edit Fasilitas" : "Tambah Fasilitas Baru"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="nama">Nama Fasilitas</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="deskripsi">Deskripsi</Label>
                  <Textarea
                    id="deskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    required
                    rows={6}
                  />
                </div>
                <FileUpload
                  label="Foto Fasilitas (Opsional)"
                  currentUrl={formData.foto_url}
                  onUploadComplete={(url) => setFormData({ ...formData, foto_url: url })}
                />
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
                        setFormData({ nama: "", deskripsi: "", foto_url: "" });
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
            {fasilitas.map((item) => (
              <Card key={item.id} className="shadow-soft border hover:shadow-elegant transition-smooth">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  {item.foto_url && (
                    <img src={item.foto_url} alt={item.nama} className="w-full object-contain rounded mb-3 sm:mb-4" />
                  )}
                  <h3 className="font-semibold text-base sm:text-lg mb-2">{item.nama}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3">{item.deskripsi}</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="w-full sm:w-auto">
                      <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                      <span>Edit</span>
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)} className="w-full sm:w-auto">
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                      <span>Hapus</span>
                    </Button>
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
