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

interface KegiatanData {
  id: string;
  nama_kegiatan: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string | null;
}

export default function KegiatanAdmin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [kegiatan, setKegiatan] = useState<KegiatanData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama_kegiatan: "",
    deskripsi: "",
    tanggal: "",
    lokasi: "",
  });

  useEffect(() => {
    checkAuth();
    fetchKegiatan();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/admin");
  };

  const fetchKegiatan = async () => {
    const { data } = await supabase.from("kegiatan").select("*").order("tanggal", { ascending: false });
    if (data) setKegiatan(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const oldData = kegiatan.find(k => k.id === editingId);
        const { error } = await supabase
          .from("kegiatan")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
        
        await logAdminActivity({
          action: "UPDATE",
          tableName: "kegiatan",
          recordId: editingId,
          oldData,
          newData: formData,
          description: `Update kegiatan: ${formData.nama_kegiatan}`,
        });
        
        toast({ title: "Kegiatan berhasil diupdate!" });
      } else {
        const { data, error } = await supabase.from("kegiatan").insert([formData]).select();
        if (error) throw error;
        
        await logAdminActivity({
          action: "CREATE",
          tableName: "kegiatan",
          recordId: data?.[0]?.id,
          newData: formData,
          description: `Tambah kegiatan baru: ${formData.nama_kegiatan}`,
        });
        
        toast({ title: "Kegiatan berhasil ditambahkan!" });
      }
      setFormData({ nama_kegiatan: "", deskripsi: "", tanggal: "", lokasi: "" });
      setIsEditing(false);
      setEditingId(null);
      fetchKegiatan();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleEdit = (item: KegiatanData) => {
    setFormData({
      nama_kegiatan: item.nama_kegiatan,
      deskripsi: item.deskripsi,
      tanggal: item.tanggal,
      lokasi: item.lokasi || "",
    });
    setEditingId(item.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    try {
      const deletedItem = kegiatan.find(k => k.id === id);
      const { error } = await supabase.from("kegiatan").delete().eq("id", id);
      if (error) throw error;
      
      await logAdminActivity({
        action: "DELETE",
        tableName: "kegiatan",
        recordId: id,
        oldData: deletedItem,
        description: `Hapus kegiatan: ${deletedItem?.nama_kegiatan}`,
      });
      
      toast({ title: "Kegiatan berhasil dihapus!" });
      fetchKegiatan();
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
          <h1 className="text-2xl font-bold">Kelola Kegiatan</h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nama_kegiatan">Nama Kegiatan</Label>
                  <Input
                    id="nama_kegiatan"
                    value={formData.nama_kegiatan}
                    onChange={(e) => setFormData({ ...formData, nama_kegiatan: e.target.value })}
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
                  <Label htmlFor="lokasi">Lokasi (Opsional)</Label>
                  <Input
                    id="lokasi"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
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
                        setFormData({ nama_kegiatan: "", deskripsi: "", tanggal: "", lokasi: "" });
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
            {kegiatan.map((item) => (
              <Card key={item.id} className="shadow-soft border-0">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{item.nama_kegiatan}</h3>
                  <p className="text-sm text-primary mb-2">
                    {new Date(item.tanggal).toLocaleDateString("id-ID")}
                  </p>
                  {item.lokasi && <p className="text-sm text-muted-foreground mb-2">{item.lokasi}</p>}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.deskripsi}</p>
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
