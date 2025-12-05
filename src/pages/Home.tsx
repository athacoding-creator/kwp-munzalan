import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Heart, Users, BookOpen, Home as HomeIcon, Leaf, Fish, Moon, Sparkles, Target, Eye, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WaveDivider, WaveDividerSimple } from "@/components/WaveDivider";
import { CircleImage } from "@/components/CircleImage";

// Import images
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";
import hero5 from "@/assets/hero-5.jpg";


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

interface ProgramUnggulan {
  id: string;
  nama: string;
  subtitle: string;
  deskripsi: string | null;
  icon_name: string;
  urutan: number;
  is_active: boolean;
}

// Icon mapping
const iconMap: Record<string, any> = {
  Heart,
  BookOpen,
  Users,
  Moon,
};

const colorClasses = ["bg-primary", "bg-primary-light", "bg-accent"];

// Facilities data matching the brochure
const facilities = [
  { icon: HomeIcon, title: "Masjid / Musholla", description: "Pusat ibadah dan kegiatan keagamaan", image: hero1 },
  { icon: Leaf, title: "Green House", description: "Area pertanian produktif", image: hero2 },
  { icon: HomeIcon, title: "Guest House", description: "Penginapan untuk tamu", image: hero3 },
  { icon: Fish, title: "Perikanan", description: "Budidaya ikan produktif", image: hero4 },
];

// Why Wakaf reasons
const wakafReasons = [
  { icon: Heart, text: "Mendukung Gerakan Dakwah Kemasjidan" },
  { icon: Sparkles, text: "Dampak Berkelanjutan (Sadaqah Jariyah)" },
  { icon: Users, text: "Menguatkan Ekosistem Peradaban" },
  { icon: Target, text: "Diniatkan untuk Menghidupkan Masjid & Umat" },
];

export default function Home() {
  const [kegiatanTerbaru, setKegiatanTerbaru] = useState<Kegiatan[]>([]);
  const [pengumumanTerbaru, setPengumumanTerbaru] = useState<Pengumuman[]>([]);
  const [programs, setPrograms] = useState<ProgramUnggulan[]>([]);

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

    const { data: programsData } = await supabase
      .from("programs")
      .select("*")
      .eq("is_active", true)
      .order("urutan", { ascending: true });

    if (kegiatan) setKegiatanTerbaru(kegiatan);
    if (pengumuman) setPengumumanTerbaru(pengumuman);
    if (programsData) setPrograms(programsData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section - Matching Brochure Style */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary-light/5">
        {/* Background Pattern */}
        <div className="absolute inset-0 islamic-pattern opacity-50" />
        
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left animate-fade-in">
              
              <div className="badge-primary mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Kawasan Wakaf Produktif</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-gradient">BAITUL WAQOF</span>
                <br />
                <span className="text-foreground">MUNZALAN</span>
                <br />
                <span className="text-primary-light text-3xl md:text-4xl">INDONESIA</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-primary font-medium mb-4 italic">
                "Jembatan Amal Sholeh dari Orang Baik untuk Orang Baik"
              </p>
              
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                Kawasan Wakaf Produktif (KWP) adalah sebuah area yang dikelola secara amanah dan profesional 
                untuk menghadirkan manfaat berkelanjutan bagi masjid, jamaah, dan masyarakat.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/profil">
                  <Button size="lg" className="w-full sm:w-auto gradient-primary text-primary-foreground shadow-elegant hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Jelajahi KWP
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/kontak">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Hubungi Kami
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right Content - Circular Images */}
            <div className="hidden lg:block relative animate-scale-in">
              <div className="relative w-full h-[500px]">
                {/* Main large circle */}
                <CircleImage
                  src={hero1}
                  alt="Kegiatan KWP"
                  size="xl"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                />
                {/* Smaller circles around */}
                <CircleImage
                  src={hero2}
                  alt="Kegiatan 2"
                  size="lg"
                  borderColor="accent"
                  className="absolute top-0 left-0 z-10"
                />
                <CircleImage
                  src={hero3}
                  alt="Kegiatan 3"
                  size="md"
                  className="absolute top-10 right-10 z-10"
                />
                <CircleImage
                  src={hero4}
                  alt="Kegiatan 4"
                  size="lg"
                  borderColor="accent"
                  className="absolute bottom-0 right-0 z-10"
                />
                <CircleImage
                  src={hero5}
                  alt="Kegiatan 5"
                  size="md"
                  className="absolute bottom-10 left-10 z-10"
                />
              </div>
            </div>
          </div>
        </div>
        
        <WaveDivider className="absolute bottom-0 left-0 right-0" variant="white" />
      </section>

      {/* CTA Banner */}
      <section className="py-8 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2 animate-fade-in">
            Yuk, Jadi Bagian dari Gerakan Kebaikan Ini!
          </h2>
          <p className="text-primary-foreground/80 mb-4">Jangan bosan jadi orang baik</p>
          <Link to="/kontak">
            <Button size="lg" variant="secondary" className="shadow-elegant hover:scale-105 transition-all duration-300">
              Bergabung Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="badge-primary mb-4 mx-auto">
              <BookOpen className="w-4 h-4" />
              <span>Program Unggulan</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">PROGRAM</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Berbagai program kegiatan yang kami selenggarakan untuk memberdayakan umat
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {programs.map((program, index) => {
              const IconComponent = iconMap[program.icon_name] || Heart;
              const colorClass = colorClasses[index % colorClasses.length];
              return (
                <Card 
                  key={program.id}
                  className="group card-hover border-0 shadow-card bg-card animate-fade-in overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-full ${colorClass} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-bold text-foreground mb-1">{program.nama}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{program.subtitle}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <WaveDividerSimple variant="muted" />

      {/* Facilities Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="badge-accent mb-4 mx-auto">
              <HomeIcon className="w-4 h-4" />
              <span>Sarana & Prasarana</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">FASILITAS KWP</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Fasilitas yang tersedia di Kawasan Wakaf Produktif Munzalan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility, index) => (
              <Card 
                key={facility.title}
                className="group card-hover border-0 shadow-card overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={facility.image} 
                    alt={facility.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto -mt-9 mb-2 rounded-full gradient-primary flex items-center justify-center shadow-elegant relative z-10">
                    <facility.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground">{facility.title}</h3>
                  <p className="text-sm text-muted-foreground">{facility.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/fasilitas">
              <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Lihat Semua Fasilitas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <WaveDividerSimple flip variant="muted" />

      {/* Vision Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Vision */}
            <Card className="border-0 shadow-elegant overflow-hidden animate-fade-in">
              <div className="gradient-primary p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">VISI</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Menjadi lembaga sosial keummatan berbasis Masjid terbaik di Indonesia yang 
                  <span className="text-primary font-semibold"> amanah, profesional dan transparan </span>
                  berbasis ketaqwaan dan keberjama'ahan.
                </p>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className="border-0 shadow-elegant overflow-hidden animate-fade-in delay-200">
              <div className="gradient-accent p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">MISI</h3>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                {[
                  "Menghadirkan semangat kebersamaan, kepedulian, kasih sayang untuk memuliakan, melayani, membahagiakan sahabat yatim, penghafal Al-Qur'an, mustahiq dan fii sabilillah.",
                  "Melaksanakan gerakan dakwah bil hal dengan mengkampanyekan seruan \"Jangan Bosan Jadi Orang Baik\".",
                  "Membentuk, mendidik dan memberdayakan santri PASKAS sebagai jembatan amal sholeh.",
                ].map((misi, index) => (
                  <div key={index} className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{misi}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Wakaf Section */}
      <section className="py-20 gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Kenapa Harus Wakaf di Baitul Wakaf Munzalan?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Wakaf Dikelola Secara Produktif untuk Infaq!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {wakafReasons.map((reason, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                  <reason.icon className="h-7 w-7 text-white" />
                </div>
                <p className="text-white font-medium">{reason.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kegiatan Terbaru */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="badge-primary mb-4 mx-auto">
              <Calendar className="w-4 h-4" />
              <span>Aktivitas Terkini</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Kegiatan Terbaru</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ikuti berbagai kegiatan dan program berkualitas yang kami adakan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {kegiatanTerbaru.map((kegiatan, index) => (
              <Card 
                key={kegiatan.id} 
                className="group card-hover border-0 shadow-soft bg-card animate-fade-in overflow-hidden"
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
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
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

          <div className="text-center mt-12 animate-fade-in delay-500">
            <Link to="/kegiatan">
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Lihat Semua Kegiatan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pengumuman */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="badge-accent mb-4 mx-auto">
              <Sparkles className="w-4 h-4" />
              <span>Informasi Terkini</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Pengumuman</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Informasi penting untuk seluruh keluarga besar KWP Munzalan
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {pengumumanTerbaru.map((pengumuman, index) => (
              <Card 
                key={pengumuman.id} 
                className="group card-hover border-0 shadow-soft bg-card animate-fade-in"
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
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {pengumuman.judul}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{pengumuman.isi}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 animate-fade-in delay-500">
            <Link to="/pengumuman">
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
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
