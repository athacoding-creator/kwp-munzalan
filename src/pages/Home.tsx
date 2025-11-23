import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Image as ImageIcon } from "lucide-react";
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

      {/* Hero Section */}
      <section className="relative py-20 islamic-pattern">
        <div className="absolute inset-0 gradient-hero pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Selamat Datang di KWP Munzalan
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Lembaga pendidikan Islam yang berkomitmen membentuk generasi Qurani, berakhlak mulia, dan berprestasi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/profil">
                <Button size="lg" className="gradient-primary text-primary-foreground shadow-elegant">
                  Tentang Kami
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/kontak">
                <Button size="lg" variant="outline">
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-soft border-0">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">10+</h3>
                <p className="text-muted-foreground">Tahun Berpengalaman</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft border-0">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">500+</h3>
                <p className="text-muted-foreground">Santri Aktif</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft border-0">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-3xl font-bold text-primary mb-2">20+</h3>
                <p className="text-muted-foreground">Pengajar Berkualitas</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Kegiatan Terbaru */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kegiatan Terbaru</h2>
            <p className="text-muted-foreground">Ikuti berbagai kegiatan dan program yang kami adakan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {kegiatanTerbaru.map((kegiatan) => (
              <Card key={kegiatan.id} className="shadow-soft border-0 hover:shadow-elegant transition-smooth">
                <CardContent className="p-6">
                  <div className="text-sm text-primary mb-2">
                    {new Date(kegiatan.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{kegiatan.nama_kegiatan}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{kegiatan.deskripsi}</p>
                  <Link to="/kegiatan">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                      Selengkapnya
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/kegiatan">
              <Button variant="outline" size="lg">
                Lihat Semua Kegiatan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pengumuman */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pengumuman</h2>
            <p className="text-muted-foreground">Informasi terkini untuk santri dan orang tua</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {pengumumanTerbaru.map((pengumuman) => (
              <Card key={pengumuman.id} className="shadow-soft border-0">
                <CardContent className="p-6">
                  <div className="text-sm text-primary mb-2">
                    {new Date(pengumuman.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{pengumuman.judul}</h3>
                  <p className="text-muted-foreground">{pengumuman.isi}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/pengumuman">
              <Button variant="outline" size="lg">
                Lihat Semua Pengumuman
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
