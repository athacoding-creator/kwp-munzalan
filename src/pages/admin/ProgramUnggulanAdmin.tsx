import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Pencil, Trash2, Home, Heart, BookOpen, Users, Moon, GripVertical } from "lucide-react";
import { logAdminActivity } from "@/lib/adminLogger";

interface ProgramUnggulan {
  id: string;
  nama: string;
  subtitle: string;
  deskripsi: string | null;
  icon_name: string;
  urutan: number;
  is_active: boolean;
}

const iconOptions = [
  { value: "Heart", label: "Heart", icon: Heart },
  { value: "BookOpen", label: "Book", icon: BookOpen },
  { value: "Users", label: "Users", icon: Users },
  { value: "Moon", label: "Moon", icon: Moon },
];

const getIconComponent = (iconName: string) => {
  const found = iconOptions.find(opt => opt.value === iconName);
  return found ? found.icon : Heart;
};

export default function ProgramUnggulanAdmin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [programs, setPrograms] = useState<ProgramUnggulan[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    subtitle: "",
    deskripsi: "",
    icon_name: "Heart",
    urutan: 0,
    is_active: true,
  });

  useEffect(() => {
    checkAuth();
    fetchPrograms();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/admin");
  };

  const fetchPrograms = async () => {
    const { data } = await supabase
      .from("programs")
      .select("*")
      .order("urutan", { ascending: true });
    if (data) setPrograms(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const oldData = programs.find(p => p.id === editingId);
        const { error } = await supabase
          .from("programs")
          .update(formData)
          .eq("id", editingId);
        if (error) throw error;
        
        await logAdminActivity({
          action: "UPDATE",
          tableName: "programs",
          recordId: editingId,
          oldData,
          newData: formData,
          description: `Update program unggulan: ${formData.nama}`,
        });
        
        toast({ title: "Program berhasil diupdate!" });
      } else {
        const { data, error } = await supabase
          .from("programs")
          .insert([{ ...formData, urutan: programs.length + 1 }])
          .select();
        if (error) throw error;
        
        await logAdminActivity({
          action: "CREATE",
          tableName: "programs",
          recordId: data?.[0]?.id,
          newData: formData,
          description: `Tambah program unggulan baru: ${formData.nama}`,
        });
        
        toast({ title: "Program berhasil ditambahkan!" });
      }
      resetForm();
      fetchPrograms();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({ nama: "", subtitle: "", deskripsi: "", icon_name: "Heart", urutan: 0, is_active: true });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (item: ProgramUnggulan) => {
    setFormData({
      nama: item.nama,
      subtitle: item.subtitle,
      deskripsi: item.deskripsi || "",
      icon_name: item.icon_name,
      urutan: item.urutan,
      is_active: item.is_active,
    });
    setEditingId(item.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus program ini?")) return;
    try {
      const deletedItem = programs.find(p => p.id === id);
      const { error } = await supabase.from("programs").delete().eq("id", id);
      if (error) throw error;
      
      await logAdminActivity({
        action: "DELETE",
        tableName: "programs",
        recordId: id,
        oldData: deletedItem,
        description: `Hapus program unggulan: ${deletedItem?.nama}`,
      });
      
      toast({ title: "Program berhasil dihapus!" });
      fetchPrograms();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("programs")
        .update({ is_active: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      
      await logAdminActivity({
        action: "UPDATE",
        tableName: "programs",
        recordId: id,
        description: `Toggle status program: ${!currentStatus ? 'Aktif' : 'Nonaktif'}`,
      });
      
      fetchPrograms();
      toast({ title: `Program ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}` });
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
              <h1 className="text-base sm:text-lg md:text-2xl font-bold truncate">Kelola Program Unggulan</h1>
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
          {/* Form */}
          <Card className="shadow-soft border-0 h-fit">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                  <Plus className="h-4 w-4 text-white" />
                </div>
                {isEditing ? "Edit Program Unggulan" : "Tambah Program Unggulan"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nama">Nama Program</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    placeholder="Contoh: MMP, Tahsin Warga"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Deskripsi singkat program"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="icon_name">Icon</Label>
                  <Select
                    value={formData.icon_name}
                    onValueChange={(value) => setFormData({ ...formData, icon_name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih icon" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <opt.icon className="h-4 w-4" />
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="deskripsi">Deskripsi (Opsional)</Label>
                  <Textarea
                    id="deskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    placeholder="Penjelasan lengkap tentang program"
                    rows={4}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label>Tampilkan di website</Label>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="submit" className="gradient-primary text-primary-foreground w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    {isEditing ? "Update" : "Tambah"}
                  </Button>
                  {isEditing && (
                    <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={resetForm}>
                      Batal
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* List */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Daftar Program Unggulan ({programs.length})</h3>
            {programs.length === 0 ? (
              <Card className="shadow-soft border-0">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Heart className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Belum ada program unggulan</p>
                </CardContent>
              </Card>
            ) : (
              programs.map((item) => {
                const IconComponent = getIconComponent(item.icon_name);
                return (
                  <Card key={item.id} className={`shadow-soft border-0 overflow-hidden ${!item.is_active ? 'opacity-60' : ''}`}>
                    <div className="h-1 bg-gradient-to-r from-primary to-accent" />
                    <CardContent className="p-3 sm:p-4 md:p-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-base sm:text-lg text-foreground truncate">{item.nama}</h3>
                            {!item.is_active && (
                              <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">Nonaktif</span>
                            )}
                          </div>
                          <p className="text-sm text-primary mb-1">{item.subtitle}</p>
                          {item.deskripsi && (
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{item.deskripsi}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="w-full sm:w-auto">
                          <Pencil className="h-3.5 w-3.5 sm:mr-2" />
                          <span className="sm:inline">Edit</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => toggleActive(item.id, item.is_active)}
                          className="w-full sm:w-auto"
                        >
                          {item.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)} className="w-full sm:w-auto">
                          <Trash2 className="h-3.5 w-3.5 sm:mr-2" />
                          <span className="sm:inline">Hapus</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}