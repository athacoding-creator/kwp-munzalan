import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";

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
        const { error } = await supabase
          .from("profil")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
        toast({ title: "Profil berhasil diupdate!" });
      } else {
        const { error } = await supabase.from("profil").insert([formData]);
        if (error) throw error;
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
      const { error } = await supabase.from("profil").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Profil berhasil dihapus!" });
      fetchProfil();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <nav className="bg-card border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-2xl font-bold">Kelola Profil</h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Profil" : "Tambah Profil Baru"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <div>
                  <Label htmlFor="foto_profil_url">URL Foto (Opsional)</Label>
                  <Input
                    id="foto_profil_url"
                    value={formData.foto_profil_url}
                    onChange={(e) => setFormData({ ...formData, foto_profil_url: e.target.value })}
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

          <div className="space-y-4">
            {profil.map((item) => (
              <Card key={item.id} className="shadow-soft border-0">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{item.judul}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.konten}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus
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
