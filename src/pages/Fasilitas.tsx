import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WaveDivider, WaveDividerSimple } from "@/components/WaveDivider";
import { Building2, Trees, Home, Fish, BookOpen, Users } from "lucide-react";

interface FasilitasData {
  id: string;
  nama: string;
  deskripsi: string;
  foto_url: string | null;
}

// Default facilities matching the brochure
const defaultFasilitas = [
  {
    id: "1",
    nama: "Masjid",
    deskripsi: "Tempat ibadah utama dengan kapasitas besar untuk kegiatan sholat berjamaah dan kajian",
    icon: Building2,
  },
  {
    id: "2",
    nama: "Green House",
    deskripsi: "Fasilitas pertanian modern untuk pembelajaran budidaya tanaman",
    icon: Trees,
  },
  {
    id: "3",
    nama: "Guest House",
    deskripsi: "Penginapan nyaman untuk tamu dan wali santri yang berkunjung",
    icon: Home,
  },
  {
    id: "4",
    nama: "Perikanan",
    deskripsi: "Area budidaya ikan untuk pembelajaran dan kemandirian ekonomi",
    icon: Fish,
  },
  {
    id: "5",
    nama: "Perpustakaan",
    deskripsi: "Koleksi lengkap buku-buku Islam dan pengetahuan umum",
    icon: BookOpen,
  },
  {
    id: "6",
    nama: "Aula Serbaguna",
    deskripsi: "Ruang multifungsi untuk berbagai kegiatan dan acara",
    icon: Users,
  },
];

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
      <section className="relative gradient-dramatic text-primary-foreground py-24 overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-6">
              Fasilitas Lengkap
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Fasilitas Kami
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Berbagai fasilitas lengkap dan modern untuk mendukung pembelajaran dan kegiatan santri dalam lingkungan yang nyaman
            </p>
          </div>
        </div>
        <WaveDivider variant="white" />
      </section>

      {/* Main Facilities from Brochure */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="badge-primary mb-4">
              <Building2 className="w-4 h-4" />
              Infrastruktur
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Fasilitas Unggulan
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fasilitas modern yang mendukung proses pembelajaran dan kehidupan santri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {defaultFasilitas.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card 
                  key={item.id} 
                  className="group shadow-soft border-0 overflow-hidden hover:shadow-dramatic transition-all duration-500 hover:-translate-y-2 bg-card"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-2xl gradient-dramatic flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-elegant">
                      <IconComponent className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {item.nama}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <WaveDividerSimple variant="primary" flip />

      {/* Dynamic Facilities from Database */}
      {fasilitas.length > 0 && (
        <section className="py-20 gradient-royal text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-4">
                Galeri Fasilitas
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Dokumentasi Fasilitas
              </h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto">
                Lihat lebih dekat fasilitas-fasilitas yang kami sediakan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fasilitas.map((item, index) => (
                <Card 
                  key={item.id} 
                  className="group shadow-dramatic border-0 overflow-hidden bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.foto_url && (
                    <div className="relative overflow-hidden">
                      <img
                        src={item.foto_url}
                        alt={item.nama}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-primary-foreground">
                      {item.nama}
                    </h3>
                    <p className="text-primary-foreground/80 leading-relaxed">
                      {item.deskripsi}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && fasilitas.length === 0 && (
        <section className="py-16 gradient-royal text-primary-foreground">
          <div className="container mx-auto px-4">
            <Card className="shadow-dramatic border-0 bg-white/10 backdrop-blur-sm max-w-2xl mx-auto">
              <CardContent className="p-12 text-center">
                <Building2 className="w-16 h-16 mx-auto mb-6 text-primary-foreground/60" />
                <h3 className="text-xl font-semibold mb-2 text-primary-foreground">
                  Dokumentasi Akan Segera Tersedia
                </h3>
                <p className="text-primary-foreground/70">
                  Foto dan informasi detail fasilitas akan segera ditampilkan di sini.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <WaveDividerSimple variant="white" />

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ingin Melihat Fasilitas Secara Langsung?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Kunjungi KWP Munzalan dan lihat sendiri berbagai fasilitas yang kami sediakan untuk mendukung pendidikan Islam berkualitas.
            </p>
            <a
              href="/kontak"
              className="inline-flex items-center gap-2 px-8 py-4 gradient-dramatic text-primary-foreground rounded-full font-semibold hover:shadow-dramatic transition-all duration-300 hover:-translate-y-1"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
