import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface FasilitasData {
  id: string;
  nama: string;
  deskripsi: string;
  foto_url: string | null;
}

export default function Fasilitas() {
  const [fasilitas, setFasilitas] = useState<FasilitasData[]>([]);
  const [loading, setLoading] = useState(true);

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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary-light/10 py-20 overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-30" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Fasilitas Kami
            </h1>
            <p className="text-xl text-muted-foreground">
              Berbagai fasilitas lengkap untuk mendukung pembelajaran dan kegiatan
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Memuat fasilitas...</p>
            </div>
          ) : fasilitas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {fasilitas.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="group shadow-elegant border-0 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Image Section */}
                  {item.foto_url ? (
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={item.foto_url}
                        alt={item.nama}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center">
                      <div className="text-center p-6">
                        <svg className="w-16 h-16 mx-auto text-primary/40 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-muted-foreground">Gambar akan segera tersedia</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Content Section */}
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {item.nama}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-elegant border-0">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-foreground">
                    Informasi Fasilitas Akan Segera Tersedia
                  </h3>
                  <p className="text-muted-foreground">
                    Kami sedang mempersiapkan informasi lengkap tentang fasilitas-fasilitas kami. Silakan kembali lagi nanti.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-primary-light/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Ingin Melihat Fasilitas Secara Langsung?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Kunjungi KWP Munzalan dan lihat sendiri berbagai fasilitas yang kami sediakan untuk mendukung pendidikan Islam berkualitas.
            </p>
            <a
              href="/kontak"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-full font-semibold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              Hubungi Kami
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
