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
    <div className="min-h-screen bg-muted/30 overflow-x-hidden">
      <nav className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")} className="h-8 sm:h-9 px-2 sm:px-3 flex-shrink-0">
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Kembali</span>
              </Button>
              <h1 className="text-base sm:text-lg md:text-2xl font-bold truncate">Kelola Pengumuman</h1>
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
              <CardTitle className="text-base sm:text-lg">{isEditing ? "Edit Pengumuman" : "Tambah Pengumuman Baru"}</CardTitle>
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

          <div className="space-y-3 sm:space-y-4">
            {pengumuman.map((item) => (
              <Card key={item.id} className="shadow-soft border hover:shadow-elegant transition-smooth">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <h3 className="font-semibold text-base sm:text-lg mb-2">{item.judul}</h3>
                  <p className="text-xs sm:text-sm text-primary mb-2">
                    {new Date(item.tanggal).toLocaleDateString("id-ID")}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3">{item.isi}</p>
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
