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
              <div className="max-w-4xl mx-auto space-y-6">
                {artikel.map((item, index) => (
                  <Card 
                    key={item.id} 
                    className="group shadow-elegant border-0 hover:shadow-2xl transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {new Date(item.tanggal).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                        {item.judul}
                      </h3>
                      <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {item.isi}
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
