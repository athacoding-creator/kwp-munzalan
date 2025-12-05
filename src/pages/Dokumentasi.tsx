import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Image as ImageIcon, Video, Layers, Camera } from "lucide-react";
import { MasonryGallery } from "@/components/MasonryGallery";
import { Skeleton } from "@/components/ui/skeleton";
import { WaveDivider } from "@/components/WaveDivider";

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
    
    const { data: dokData } = await supabase
      .from("dokumentasi")
      .select(`
        *,
        kegiatan:kegiatan_id (
          nama_kegiatan
        )
      `)
      .order("created_at", { ascending: false });
    
    const { data: kegData } = await supabase
      .from("kegiatan")
      .select("id, nama_kegiatan")
      .order("nama_kegiatan");
    
    if (dokData) setDokumentasi(dokData);
    if (kegData) setKegiatan(kegData);
    setIsLoading(false);
  };

  const filteredData = dokumentasi.filter((item) => {
    if (mediaFilter !== "semua" && item.jenis_media !== mediaFilter) {
      return false;
    }
    if (kegiatanFilter !== "semua" && item.kegiatan_id !== kegiatanFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Header */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 islamic-pattern opacity-50" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="badge-primary mb-6 mx-auto">
              <Camera className="w-4 h-4" />
              <span>Gallery Premium</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Galeri <span className="text-gradient">Dokumentasi</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kumpulan momen berharga dan kegiatan inspiratif di KWP Munzalan
            </p>
          </div>
        </div>
        
        <WaveDivider className="absolute bottom-0 left-0 right-0" variant="white" />
      </section>

      {/* Advanced Filters */}
      <section className="py-8 border-y border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {/* Media Type Filter */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-foreground">Tipe Media</h3>
              <div className="flex flex-wrap gap-3">
                <Badge
                  variant={mediaFilter === "semua" ? "default" : "outline"}
                  className={`cursor-pointer px-6 py-2.5 transition-all duration-300 hover:scale-105 ${
                    mediaFilter === "semua" 
                      ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-elegant" 
                      : "hover:bg-primary/10 hover:border-primary/50"
                  }`}
                  onClick={() => setMediaFilter("semua")}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Semua
                </Badge>
                <Badge
                  variant={mediaFilter === "foto" ? "default" : "outline"}
                  className={`cursor-pointer px-6 py-2.5 transition-all duration-300 hover:scale-105 ${
                    mediaFilter === "foto" 
                      ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-elegant" 
                      : "hover:bg-primary/10 hover:border-primary/50"
                  }`}
                  onClick={() => setMediaFilter("foto")}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Foto
                </Badge>
                <Badge
                  variant={mediaFilter === "video" ? "default" : "outline"}
                  className={`cursor-pointer px-6 py-2.5 transition-all duration-300 hover:scale-105 ${
                    mediaFilter === "video" 
                      ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-elegant" 
                      : "hover:bg-primary/10 hover:border-primary/50"
                  }`}
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
                <h3 className="text-sm font-semibold mb-3 text-foreground">Kategori Program</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge
                    variant={kegiatanFilter === "semua" ? "default" : "outline"}
                    className={`cursor-pointer px-6 py-2.5 transition-all duration-300 hover:scale-105 ${
                      kegiatanFilter === "semua" 
                        ? "bg-gradient-to-r from-accent to-primary-light text-white shadow-elegant" 
                        : "hover:bg-accent/10 hover:border-accent/50"
                    }`}
                    onClick={() => setKegiatanFilter("semua")}
                  >
                    Semua Program
                  </Badge>
                  {kegiatan.map((k) => (
                    <Badge
                      key={k.id}
                      variant={kegiatanFilter === k.id ? "default" : "outline"}
                      className={`cursor-pointer px-6 py-2.5 transition-all duration-300 hover:scale-105 ${
                        kegiatanFilter === k.id 
                          ? "bg-gradient-to-r from-accent to-primary-light text-white shadow-elegant" 
                          : "hover:bg-accent/10 hover:border-accent/50"
                      }`}
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
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton 
                  key={i} 
                  className="break-inside-avoid rounded-xl"
                  style={{ height: `${200 + Math.random() * 200}px` }}
                />
              ))}
            </div>
          ) : filteredData.length > 0 ? (
            <>
              <div className="text-center mb-8 animate-fade-in">
                <p className="text-sm text-muted-foreground">
                  Menampilkan <span className="font-semibold text-primary">{filteredData.length}</span> media
                </p>
              </div>
              <MasonryGallery items={filteredData} />
            </>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
                <ImageIcon className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tidak ada hasil</h3>
              <p className="text-muted-foreground">
                Coba ubah filter untuk melihat konten lainnya
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}