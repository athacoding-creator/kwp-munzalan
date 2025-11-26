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

interface ProfilData {
  id: string;
  judul: string;
  konten: string;
  foto_profil_url: string | null;
}

export default function ProfilAdmin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profil, setProfil] = useState<ProfilData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    judul: "",
    konten: "",
    foto_profil_url: "",
  });

  useEffect(() => {
    checkAuth();
    fetchProfil();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/admin");
  };

  const fetchProfil = async () => {
    const { data } = await supabase.from("profil").select("*");
    if (data) setProfil(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const oldData = profil.find(p => p.id === editingId);
        const { error } = await supabase
          .from("profil")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
        
        await logAdminActivity({
          action: "UPDATE",
          tableName: "profil",
          recordId: editingId,
          oldData,
          newData: formData,
          description: `Update profil: ${formData.judul}`,
        });
        
        toast({ title: "Profil berhasil diupdate!" });
      } else {
        const { data, error } = await supabase.from("profil").insert([formData]).select();
        if (error) throw error;
        
        await logAdminActivity({
          action: "CREATE",
          tableName: "profil",
          recordId: data?.[0]?.id,
          newData: formData,
          description: `Tambah profil baru: ${formData.judul}`,
        });
        
        toast({ title: "Profil berhasil ditambahkan!" });
      }
      setFormData({ judul: "", konten: "", foto_profil_url: "" });
      setIsEditing(false);
      setEditingId(null);
      fetchProfil();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (item: ProfilData) => {
    setFormData({
      judul: item.judul,
      konten: item.konten,
      foto_profil_url: item.foto_profil_url || "",
    });
    setEditingId(item.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      const deletedItem = profil.find(p => p.id === id);
      const { error } = await supabase.from("profil").delete().eq("id", id);
      if (error) throw error;
      
      await logAdminActivity({
        action: "DELETE",
        tableName: "profil",
        recordId: id,
        oldData: deletedItem,
        description: `Hapus profil: ${deletedItem?.judul}`,
      });
      
      toast({ title: "Profil berhasil dihapus!" });
      fetchProfil();
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
              <h1 className="text-base sm:text-lg md:text-2xl font-bold truncate">Kelola Profil</h1>
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
              <CardTitle className="text-base sm:text-lg">{isEditing ? "Edit Profil" : "Tambah Profil Baru"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="judul">Judul</Label>
                  <Input
                    id="judul"
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="konten">Konten</Label>
                  <Textarea
                    id="konten"
                    value={formData.konten}
                    onChange={(e) => setFormData({ ...formData, konten: e.target.value })}
                    required
                    rows={8}
                  />
                </div>
                <FileUpload
                  label="Foto Profil (Opsional)"
                  currentUrl={formData.foto_profil_url}
                  onUploadComplete={(url) => setFormData({ ...formData, foto_profil_url: url })}
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
                        setFormData({ judul: "", konten: "", foto_profil_url: "" });
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
            {profil.map((item) => (
              <Card key={item.id} className="shadow-soft border hover:shadow-elegant transition-smooth">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  {item.foto_profil_url && (
                    <img src={item.foto_profil_url} alt={item.judul} className="w-full object-contain rounded mb-3 sm:mb-4" />
                  )}
                  <h3 className="font-semibold text-base sm:text-lg mb-2">{item.judul}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3">{item.konten}</p>
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
