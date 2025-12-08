import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WaveDivider } from "@/components/WaveDivider";
import { Calendar, Bell, Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ArtikelData {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
  gambar_url?: string | null;
}

export default function Artikel() {
  const [artikel, setArtikel] = useState<ArtikelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtikel, setSelectedArtikel] = useState<ArtikelData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchArtikel();
  }, []);

  const fetchArtikel = async () => {
    const { data } = await supabase.from("pengumuman").select("*").order("tanggal", { ascending: false });
    if (data) setArtikel(data);
    setLoading(false);
  };

  const filteredArtikel = artikel.filter(item => 
    item.judul.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Detail View
  if (selectedArtikel) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <div className="flex-1">
          {/* Hero Section */}
          <section className="relative bg-gradient-primary py-12 overflow-hidden">
            <div className="absolute inset-0 islamic-pattern opacity-10"></div>
            <div className="container mx-auto px-4 relative z-10">
              <button 
                onClick={() => setSelectedArtikel(null)}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
              >
                <ArrowLeft className="h-5 w-5" />
                Kembali ke Daftar Artikel
              </button>
            </div>
          </section>

          {/* Content */}
          <section className="py-12 md:py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Sidebar */}
                  <div className="lg:col-span-4 order-2 lg:order-1">
                    {/* Search */}
                    <div className="mb-8">
                      <div className="relative">
                        <Input
                          placeholder="Cari Artikel..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pr-12"
                        />
                        <button className="absolute right-0 top-0 h-full px-4 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 transition-colors">
                          <Search className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Article List */}
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-foreground">Artikel Lainnya</h3>
                      <div className="w-12 h-1 bg-primary mb-4"></div>
                      <div className="space-y-3">
                        {filteredArtikel.filter(a => a.id !== selectedArtikel.id).slice(0, 6).map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setSelectedArtikel(item)}
                            className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                          >
                            {item.judul}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* CTA Box */}
                    <Card className="mt-8 bg-primary text-primary-foreground border-0">
                      <CardContent className="p-6">
                        <h4 className="text-xl font-bold mb-4">Hubungi Kami</h4>
                        <p className="text-primary-foreground/80 text-sm mb-4">
                          Untuk informasi lebih lanjut tentang program dan pendaftaran santri baru.
                        </p>
                        <a 
                          href="/kontak"
                          className="inline-block w-full text-center py-2 bg-background text-foreground rounded-lg font-medium hover:bg-background/90 transition-colors"
                        >
                          Kontak Kami
                        </a>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Main Content */}
                  <div className="lg:col-span-8 order-1 lg:order-2">
                    {/* Featured Image */}
                    {selectedArtikel.gambar_url ? (
                      <div className="rounded-xl overflow-hidden mb-8 aspect-video bg-muted">
                        <img
                          src={selectedArtikel.gambar_url}
                          alt={selectedArtikel.judul}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="rounded-xl aspect-video bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center mb-8">
                        <Bell className="w-24 h-24 text-primary/30" />
                      </div>
                    )}

                    {/* Title & Content */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedArtikel.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                      {selectedArtikel.judul}
                    </h1>

                    <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {selectedArtikel.isi}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    );
  }

  // List View
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
                      className="group bg-card border-0 shadow-sm hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 rounded-xl overflow-hidden cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => setSelectedArtikel(item)}
                    >
                      {/* Image */}
                      <div className="p-4 pb-0">
                        {item.gambar_url ? (
                          <div className="rounded-xl aspect-[4/3] bg-muted overflow-hidden">
                            <img
                              src={item.gambar_url}
                              alt={item.judul}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="rounded-xl aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center">
                            <Bell className="w-16 h-16 text-primary/40" />
                          </div>
                        )}
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
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group/link">
                          SELENGKAPNYA 
                          <span className="group-hover/link:translate-x-1 transition-transform">»</span>
                        </span>
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