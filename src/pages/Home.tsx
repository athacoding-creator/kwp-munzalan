import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Image as ImageIcon, Sparkles, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface Kegiatan {
  id: string;
  nama_kegiatan: string;
  deskripsi: string;
  tanggal: string;
}

interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
}

export default function Home() {
  const [kegiatanTerbaru, setKegiatanTerbaru] = useState<Kegiatan[]>([]);
  const [pengumumanTerbaru, setPengumumanTerbaru] = useState<Pengumuman[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: kegiatan } = await supabase
      .from("kegiatan")
      .select("*")
      .order("tanggal", { ascending: false })
      .limit(3);

    const { data: pengumuman } = await supabase
      .from("pengumuman")
      .select("*")
      .order("tanggal", { ascending: false })
      .limit(3);

    if (kegiatan) setKegiatanTerbaru(kegiatan);
    if (pengumuman) setPengumumanTerbaru(pengumuman);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Premium Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary-light/5" />
        <div className="absolute inset-0 islamic-pattern opacity-60" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl animate-pulse delay-700" />
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Lembaga Pendidikan Islam Terpercaya</span>
              </div>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-center mb-6 animate-fade-in-up leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
                Membentuk Generasi Qurani
              </span>
              <br />
              <span className="text-foreground">
                Berakhlak Mulia & Berprestasi
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-center text-muted-foreground mb-10 max-w-3xl mx-auto animate-fade-in-up delay-200 leading-relaxed">
              Kawasan Wakaf Produktif Munzalan Indonesia - Pusat kegiatan keagamaan, sosial, dan ekonomi yang mengintegrasikan pendidikan Islam modern dengan nilai-nilai tradisional
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up delay-300">
              <Link to="/profil" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gradient-primary text-primary-foreground shadow-elegant hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
                  <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Jelajahi Kami
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/kegiatan" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 hover:bg-primary/5 hover:border-primary hover:scale-105 transition-all duration-300">
                  Lihat Kegiatan
                </Button>
              </Link>
              <Link to="/kontak" className="w-full sm:w-auto">
                <Button size="lg" variant="ghost" className="w-full sm:w-auto hover:bg-primary/5 hover:scale-105 transition-all duration-300">
                  Hubungi Kami
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto animate-scale-in delay-500">
              <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-soft">
                <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-primary font-display">10+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Tahun Berpengalaman</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-soft">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-primary font-display">500+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Santri Aktif</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-soft">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-primary font-display">20+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Pengajar Berkualitas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>


      {/* Kegiatan Terbaru */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Program & Kegiatan
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Kegiatan Terbaru
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ikuti berbagai kegiatan dan program berkualitas yang kami adakan untuk pengembangan santri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {kegiatanTerbaru.map((kegiatan, index) => (
              <Card 
                key={kegiatan.id} 
                className="group shadow-soft border-0 hover:shadow-elegant transition-all duration-500 hover:-translate-y-2 bg-card/80 backdrop-blur-sm animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-primary mb-3 font-medium">
                    <Calendar className="w-4 h-4" />
                    {new Date(kegiatan.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-3 group-hover:text-primary transition-colors">
                    {kegiatan.nama_kegiatan}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                    {kegiatan.deskripsi}
                  </p>
                  <Link to="/kegiatan">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark group/btn p-0 h-auto font-semibold">
                      Selengkapnya
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-in delay-700">
            <Link to="/kegiatan">
              <Button size="lg" variant="outline" className="border-2 hover:bg-primary/5 hover:border-primary hover:scale-105 transition-all duration-300">
                Lihat Semua Kegiatan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pengumuman */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Informasi Terkini
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Pengumuman
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Informasi penting dan terkini untuk santri, orang tua, dan seluruh keluarga besar KWP Munzalan
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {pengumumanTerbaru.map((pengumuman, index) => (
              <Card 
                key={pengumuman.id} 
                className="group shadow-soft border-0 hover:shadow-elegant transition-all duration-500 hover:border-primary/30 bg-card/80 backdrop-blur-sm animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 text-sm text-primary mb-4 font-medium">
                    <Calendar className="w-4 h-4" />
                    {new Date(pengumuman.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="text-2xl font-display font-semibold mb-4 group-hover:text-primary transition-colors">
                    {pengumuman.judul}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{pengumuman.isi}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-in delay-700">
            <Link to="/pengumuman">
              <Button size="lg" variant="outline" className="border-2 hover:bg-primary/5 hover:border-primary hover:scale-105 transition-all duration-300">
                Lihat Semua Pengumuman
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
