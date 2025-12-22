import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Pencil, Trash2, Upload, X } from "lucide-react";
import { logAdminActivity } from "@/lib/adminLogger";

interface ProgramUnggulan {
  id: string;
  nama: string;
  subtitle: string;
  deskripsi: string | null;
  image_url: string | null;
  urutan: number;
  is_active: boolean;
}

export default function ProgramUnggulanAdmin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [programs, setPrograms] = useState<ProgramUnggulan[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    subtitle: "",
    deskripsi: "",
    image_url: "",
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image_url || null;

    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `program-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Gagal mengupload gambar",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imageUrl = await uploadImage();
      const submitData = { ...formData, image_url: imageUrl };

      if (editingId) {
        const oldData = programs.find(p => p.id === editingId);
        const { error } = await supabase
          .from("programs")
          .update(submitData)
          .eq("id", editingId);
        if (error) throw error;
        
        await logAdminActivity({
          action: "UPDATE",
          tableName: "programs",
          recordId: editingId,
          oldData,
          newData: submitData,
          description: `Update program unggulan: ${formData.nama}`,
        });
        
        toast({ title: "Program berhasil diupdate!" });
      } else {
        const { data, error } = await supabase
          .from("programs")
          .insert([{ ...submitData, urutan: programs.length + 1 }])
          .select();
        if (error) throw error;
        
        await logAdminActivity({
          action: "CREATE",
          tableName: "programs",
          recordId: data[0].id,
          newData: submitData,
          description: `Tambah program unggulan: ${formData.nama}`,
        });
        
        toast({ title: "Program berhasil ditambahkan!" });
      }
      
      resetForm();
      fetchPrograms();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (program: ProgramUnggulan) => {
    setIsEditing(true);
    setEditingId(program.id);
    setFormData({
      nama: program.nama,
      subtitle: program.subtitle,
      deskripsi: program.deskripsi || "",
      image_url: program.image_url || "",
      urutan: program.urutan,
      is_active: program.is_active,
    });
    setImagePreview(program.image_url);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus program ini?")) return;
    
    try {
      const program = programs.find(p => p.id === id);
      const { error } = await supabase.from("programs").delete().eq("id", id);
      if (error) throw error;
      
      await logAdminActivity({
        action: "DELETE",
        tableName: "programs",
        recordId: id,
        oldData: program,
        description: `Hapus program unggulan: ${program?.nama}`,
      });
      
      toast({ title: "Program berhasil dihapus!" });
      fetchPrograms();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus program",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      subtitle: "",
      deskripsi: "",
      image_url: "",
      urutan: 0,
      is_active: true,
    });
    setIsEditing(false);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image_url: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Program Unggulan</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? "Edit Program" : "Tambah Program Baru"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nama">Nama Program</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="deskripsi">Deskripsi</Label>
                  <Textarea
                    id="deskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Gambar Program</Label>
                  <div className="mt-2 space-y-4">
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="flex-1"
                      />
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">Aktif</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked })
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={uploading}>
                    {uploading ? "Mengupload..." : isEditing ? "Update" : "Tambah"}
                  </Button>
                  {isEditing && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Batal
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* List */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Program ({programs.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {programs.map((program) => (
                  <Card key={program.id} className="overflow-hidden">
                    <div className="flex gap-4 p-4">
                      {program.image_url && (
                        <img
                          src={program.image_url}
                          alt={program.nama}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg">{program.nama}</h3>
                            <p className="text-sm text-gray-600">{program.subtitle}</p>
                            {program.deskripsi && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {program.deskripsi}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">Urutan: {program.urutan}</span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  program.is_active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {program.is_active ? "Aktif" : "Nonaktif"}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(program)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(program.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
