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
import { FileUpload } from "@/components/FileUpload";

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
        const { error } = await supabase
          .from("fasilitas")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
        toast({ title: "Fasilitas berhasil diupdate!" });
      } else {
        const { error } = await supabase.from("fasilitas").insert([formData]);
        if (error) throw error;
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
      const { error } = await supabase.from("fasilitas").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Fasilitas berhasil dihapus!" });
      fetchFasilitas();
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
          <h1 className="text-2xl font-bold">Kelola Fasilitas</h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Fasilitas" : "Tambah Fasilitas Baru"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="space-y-4">
            {fasilitas.map((item) => (
              <Card key={item.id} className="shadow-soft border-0">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{item.nama}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{item.deskripsi}</p>
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
