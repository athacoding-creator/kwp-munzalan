import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WaveDivider } from "@/components/WaveDivider";
import { Calendar, Bell } from "lucide-react";

interface ArtikelData {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
}

export default function Artikel() {
  const [artikel, setArtikel] = useState<ArtikelData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtikel();
  }, []);

  const fetchArtikel = async () => {
    const { data } = await supabase.from("pengumuman").select("*").order("tanggal", { ascending: false });
    if (data) setArtikel(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-primary py-20 overflow-hidden">
          <div className="absolute inset-0 islamic-pattern opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                Artikel
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                Artikel dan informasi terkini untuk masyarakat
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <WaveDivider variant="white" />
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Memuat artikel...</p>
              </div>
            ) : artikel.length > 0 ? (
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {artikel.map((item, index) => (
                    <Card 
                      key={item.id} 
                      className="group bg-card border-0 shadow-sm hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 rounded-xl overflow-hidden"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Image Placeholder */}
                      <div className="p-4 pb-0">
                        <div className="rounded-xl aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center">
                          <Bell className="w-16 h-16 text-primary/40" />
                        </div>
                      </div>
                      
                      {/* Content Section */}
                      <CardContent className="p-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.tanggal).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {item.judul}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                          {item.isi}
                        </p>
                        <button className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group/link">
                          SELENGKAPNYA 
                          <span className="group-hover/link:translate-x-1 transition-transform">»</span>
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <Card className="shadow-elegant border-0">
                  <CardContent className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bell className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">
                      Belum Ada Artikel
                    </h3>
                    <p className="text-muted-foreground">
                      Artikel terbaru akan ditampilkan di sini
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
