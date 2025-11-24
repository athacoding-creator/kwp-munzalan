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
import { logAdminActivity } from "@/lib/adminLogger";

interface PengumumanData {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
}

export default function PengumumanAdmin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pengumuman, setPengumuman] = useState<PengumumanData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    judul: "",
    isi: "",
    tanggal: "",
  });

  useEffect(() => {
    checkAuth();
    fetchPengumuman();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/admin");
  };

  const fetchPengumuman = async () => {
    const { data } = await supabase.from("pengumuman").select("*").order("tanggal", { ascending: false });
    if (data) setPengumuman(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (editingId) {
        const oldData = pengumuman.find(p => p.id === editingId);
        const { error } = await supabase
          .from("pengumuman")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
        
        await logAdminActivity({
          action: "UPDATE",
          tableName: "pengumuman",
          recordId: editingId,
          oldData,
          newData: formData,
          description: `Update pengumuman: ${formData.judul}`,
        });
        
        toast({ title: "Pengumuman berhasil diupdate!" });
      } else {
        const { data, error } = await supabase.from("pengumuman").insert([{
          ...formData,
          admin_id: session?.user.id,
        }]).select();
        if (error) throw error;
        
        await logAdminActivity({
          action: "CREATE",
          tableName: "pengumuman",
          recordId: data?.[0]?.id,
          newData: formData,
          description: `Tambah pengumuman baru: ${formData.judul}`,
        });
        
        toast({ title: "Pengumuman berhasil ditambahkan!" });
      }
      setFormData({ judul: "", isi: "", tanggal: "" });
      setIsEditing(false);
      setEditingId(null);
      fetchPengumuman();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (item: PengumumanData) => {
    setFormData({
      judul: item.judul,
      isi: item.isi,
      tanggal: item.tanggal,
    });
    setEditingId(item.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      const deletedItem = pengumuman.find(p => p.id === id);
      const { error } = await supabase.from("pengumuman").delete().eq("id", id);
      if (error) throw error;
      
      await logAdminActivity({
        action: "DELETE",
        tableName: "pengumuman",
        recordId: id,
        oldData: deletedItem,
        description: `Hapus pengumuman: ${deletedItem?.judul}`,
      });
      
      toast({ title: "Pengumuman berhasil dihapus!" });
      fetchPengumuman();
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
          <h1 className="text-2xl font-bold">Kelola Pengumuman</h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Pengumuman" : "Tambah Pengumuman Baru"}</CardTitle>
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
                  <Label htmlFor="tanggal">Tanggal</Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="isi">Isi Pengumuman</Label>
                  <Textarea
                    id="isi"
                    value={formData.isi}
                    onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
                    required
                    rows={8}
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
                        setFormData({ judul: "", isi: "", tanggal: "" });
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
            {pengumuman.map((item) => (
              <Card key={item.id} className="shadow-soft border-0">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{item.judul}</h3>
                  <p className="text-sm text-primary mb-2">
                    {new Date(item.tanggal).toLocaleDateString("id-ID")}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.isi}</p>
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
