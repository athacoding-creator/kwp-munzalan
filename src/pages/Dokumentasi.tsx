import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Image as ImageIcon, Video } from "lucide-react";

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

export default function Dokumentasi() {
  const [dokumentasi, setDokumentasi] = useState<DokumentasiData[]>([]);
  const [filter, setFilter] = useState<"semua" | "foto" | "video">("semua");

  useEffect(() => {
    fetchDokumentasi();
  }, []);

  const fetchDokumentasi = async () => {
    const { data } = await supabase
      .from("dokumentasi")
      .select(`
        *,
        kegiatan:kegiatan_id (
          nama_kegiatan
        )
      `)
      .order("created_at", { ascending: false });
    if (data) setDokumentasi(data);
  };

  const filteredData = dokumentasi.filter((item) => {
    if (filter === "semua") return true;
    return item.jenis_media === filter;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Header */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5 islamic-pattern">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Dokumentasi</h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Galeri foto dan video berbagai kegiatan dan momen berharga di KWP Munzalan
            </p>
          </div>
        </section>

        {/* Filter */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-4">
              <Badge
                variant={filter === "semua" ? "default" : "outline"}
                className="cursor-pointer px-6 py-2"
                onClick={() => setFilter("semua")}
              >
                Semua
              </Badge>
              <Badge
                variant={filter === "foto" ? "default" : "outline"}
                className="cursor-pointer px-6 py-2"
                onClick={() => setFilter("foto")}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Foto
              </Badge>
              <Badge
                variant={filter === "video" ? "default" : "outline"}
                className="cursor-pointer px-6 py-2"
                onClick={() => setFilter("video")}
              >
                <Video className="h-4 w-4 mr-2" />
                Video
              </Badge>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((item) => (
                <Card key={item.id} className="shadow-soft border-0 overflow-hidden hover:shadow-elegant transition-smooth">
                  {item.jenis_media === "foto" ? (
                    <img
                      src={item.media_url}
                      alt={item.deskripsi || "Dokumentasi"}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <video
                      src={item.media_url}
                      controls
                      className="w-full h-64 object-cover bg-black"
                    />
                  )}
                  <CardContent className="p-4">
                    {item.kegiatan && (
                      <Badge variant="outline" className="mb-2">
                        {item.kegiatan.nama_kegiatan}
                      </Badge>
                    )}
                    {item.deskripsi && (
                      <p className="text-sm text-muted-foreground">{item.deskripsi}</p>
                    )}
                  </CardContent>
                </Card>
              ))}

              {filteredData.length === 0 && (
                <div className="col-span-full">
                  <Card className="shadow-soft border-0">
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground">Belum ada dokumentasi tersedia.</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
