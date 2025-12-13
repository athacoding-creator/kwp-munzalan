import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WaveDivider } from "@/components/WaveDivider";
import { Building2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FasilitasData {
  id: string;
  nama: string;
  deskripsi: string;
  foto_url: string | null;
}

export default function Fasilitas() {
  const [fasilitas, setFasilitas] = useState<FasilitasData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFasilitas, setSelectedFasilitas] = useState<FasilitasData | null>(null);

  useEffect(() => {
    fetchFasilitas();
  }, []);

  const fetchFasilitas = async () => {
    const { data } = await supabase.from("fasilitas").select("*").order("created_at", { ascending: false });
    if (data) setFasilitas(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-[#4a1d5f] via-[#7b2d8e] to-[#c2469d] py-20 overflow-hidden">
          <div className="absolute inset-0 islamic-pattern opacity-10"></div>
          <div className="w-full px-4 md:px-8 lg:px-12 relative z-10">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                Fasilitas Kami
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                Berbagai fasilitas lengkap untuk mendukung pembelajaran dan kegiatan santri
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <WaveDivider variant="white" />
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 md:py-20 bg-background">
          <div className="w-full px-4 md:px-8 lg:px-12">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">Memuat fasilitas...</p>
              </div>
            ) : fasilitas.length > 0 ? (
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {fasilitas.map((item, index) => (
                    <Card 
                      key={item.id} 
                      className="group bg-card border-0 shadow-sm hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 rounded-xl overflow-hidden cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => setSelectedFasilitas(item)}
                    >
                      {/* Image Section */}
                      <div className="p-4 pb-0">
                        {item.foto_url ? (
                          <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-muted">
                            <img
                              src={item.foto_url}
                              alt={item.nama}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="rounded-xl aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center">
                            <Building2 className="w-16 h-16 text-primary/40" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content Section */}
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                          {item.nama}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                          {item.deskripsi}
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
                      <Building2 className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">
                      Informasi Fasilitas Akan Segera Tersedia
                    </h3>
                    <p className="text-muted-foreground">
                      Kami sedang mempersiapkan informasi lengkap tentang fasilitas-fasilitas kami.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

        <WaveDivider variant="muted" />

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Ingin Melihat Fasilitas Secara Langsung?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Kunjungi KWP Munzalan dan lihat sendiri berbagai fasilitas yang kami sediakan untuk mendukung pendidikan Islam berkualitas.
              </p>
              <a
                href="/kontak"
                className="inline-flex items-center gap-2 px-8 py-4 gradient-primary text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Hubungi Kami
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedFasilitas} onOpenChange={() => setSelectedFasilitas(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedFasilitas && (
            <>
              {/* Full Image */}
              {selectedFasilitas.foto_url ? (
                <div className="w-full aspect-video bg-muted">
                  <img
                    src={selectedFasilitas.foto_url}
                    alt={selectedFasilitas.nama}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center">
                  <Building2 className="w-24 h-24 text-primary/40" />
                </div>
              )}
              
              {/* Content */}
              <div className="p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-foreground">
                    {selectedFasilitas.nama}
                  </DialogTitle>
                </DialogHeader>
                <p className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedFasilitas.deskripsi}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
