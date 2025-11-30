import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Image as ImageIcon, Video, Layers } from "lucide-react";
import { MasonryGallery } from "@/components/MasonryGallery";
import { Skeleton } from "@/components/ui/skeleton";

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

interface KegiatanData {
  id: string;
  nama_kegiatan: string;
}

export default function Dokumentasi() {
  const [dokumentasi, setDokumentasi] = useState<DokumentasiData[]>([]);
  const [kegiatan, setKegiatan] = useState<KegiatanData[]>([]);
  const [mediaFilter, setMediaFilter] = useState<"semua" | "foto" | "video">("semua");
  const [kegiatanFilter, setKegiatanFilter] = useState<string>("semua");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch dokumentasi
    const { data: dokData } = await supabase
      .from("dokumentasi")
      .select(`
        *,
        kegiatan:kegiatan_id (
          nama_kegiatan
        )
      `)
      .order("created_at", { ascending: false });
    
    // Fetch kegiatan for filter
    const { data: kegData } = await supabase
      .from("kegiatan")
      .select("id, nama_kegiatan")
      .order("nama_kegiatan");
    
    if (dokData) setDokumentasi(dokData);
    if (kegData) setKegiatan(kegData);
    setIsLoading(false);
  };

  const filteredData = dokumentasi.filter((item) => {
    // Filter by media type
    if (mediaFilter !== "semua" && item.jenis_media !== mediaFilter) {
      return false;
    }
    
    // Filter by kegiatan
    if (kegiatanFilter !== "semua" && item.kegiatan_id !== kegiatanFilter) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Hero Header */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background islamic-pattern" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
                <Layers className="h-4 w-4" />
                <span className="text-sm font-medium">Gallery Premium</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 animate-fade-in-up delay-100">
                Galeri <span className="gradient-primary bg-clip-text text-transparent">Dokumentasi</span>
              </h1>
              
              <p className="text-lg text-muted-foreground animate-fade-in-up delay-200">
                Kumpulan momen berharga dan kegiatan inspiratif di KWP Munzalan
              </p>
            </div>
          </div>
        </section>

        {/* Advanced Filters */}
        <section className="py-8 border-y border-border bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="space-y-6">
              {/* Media Type Filter */}
              <div>
                <h3 className="text-sm font-medium mb-3 text-muted-foreground">Tipe Media</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge
                    variant={mediaFilter === "semua" ? "default" : "outline"}
                    className="cursor-pointer px-6 py-2 transition-smooth hover:scale-105"
                    onClick={() => setMediaFilter("semua")}
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    Semua
                  </Badge>
                  <Badge
                    variant={mediaFilter === "foto" ? "default" : "outline"}
                    className="cursor-pointer px-6 py-2 transition-smooth hover:scale-105"
                    onClick={() => setMediaFilter("foto")}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Foto
                  </Badge>
                  <Badge
                    variant={mediaFilter === "video" ? "default" : "outline"}
                    className="cursor-pointer px-6 py-2 transition-smooth hover:scale-105"
                    onClick={() => setMediaFilter("video")}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video
                  </Badge>
                </div>
              </div>

              {/* Kegiatan Filter */}
              {kegiatan.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3 text-muted-foreground">Kategori Kegiatan</h3>
                  <div className="flex flex-wrap gap-3">
                    <Badge
                      variant={kegiatanFilter === "semua" ? "default" : "outline"}
                      className="cursor-pointer px-6 py-2 transition-smooth hover:scale-105"
                      onClick={() => setKegiatanFilter("semua")}
                    >
                      Semua Kegiatan
                    </Badge>
                    {kegiatan.map((k) => (
                      <Badge
                        key={k.id}
                        variant={kegiatanFilter === k.id ? "default" : "outline"}
                        className="cursor-pointer px-6 py-2 transition-smooth hover:scale-105"
                        onClick={() => setKegiatanFilter(k.id)}
                      >
                        {k.nama_kegiatan}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Masonry Gallery */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton 
                    key={i} 
                    className="break-inside-avoid rounded-lg"
                    style={{ height: `${200 + Math.random() * 200}px` }}
                  />
                ))}
              </div>
            ) : filteredData.length > 0 ? (
              <>
                <div className="text-center mb-8">
                  <p className="text-sm text-muted-foreground">
                    Menampilkan <span className="font-semibold text-foreground">{filteredData.length}</span> media
                  </p>
                </div>
                <MasonryGallery items={filteredData} />
              </>
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Tidak ada hasil</h3>
                <p className="text-muted-foreground">
                  Coba ubah filter untuk melihat konten lainnya
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
