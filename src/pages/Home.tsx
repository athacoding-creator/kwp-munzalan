import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Heart, Users, BookOpen, Home as HomeIcon, Leaf, Fish, Moon, Sparkles, Target, Eye, CheckCircle, Bell, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WaveDivider, WaveDividerSimple } from "@/components/WaveDivider";
import { Input } from "@/components/ui/input";
import { CircleImage } from "@/components/CircleImage";
import ShaderBackground from "@/components/ui/shader-background";

// Import images
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";
import hero5 from "@/assets/hero-5.jpg";
interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
  gambar_url?: string | null;
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
  Moon
};
const colorClasses = ["gradient-primary", "gradient-primary", "gradient-primary"];

// Facilities data matching the brochure
const facilities = [{
  icon: HomeIcon,
  title: "Masjid / Musholla",
  description: "Pusat ibadah dan kegiatan keagamaan",
  image: hero1
}, {
  icon: Leaf,
  title: "Green House",
  description: "Area pertanian produktif",
  image: hero2
}, {
  icon: HomeIcon,
  title: "Guest House",
  description: "Penginapan untuk tamu",
  image: hero3
}, {
  icon: Fish,
  title: "Perikanan",
  description: "Budidaya ikan produktif",
  image: hero4
}];

// Why Wakaf reasons
const wakafReasons = [{
  icon: Heart,
  text: "Mendukung Gerakan Dakwah Kemasjidan"
}, {
  icon: Sparkles,
  text: "Dampak Berkelanjutan (Sadaqah Jariyah)"
}, {
  icon: Users,
  text: "Menguatkan Ekosistem Peradaban"
}, {
  icon: Target,
  text: "Diniatkan untuk Menghidupkan Masjid & Umat"
}];
export default function Home() {
  const [pengumumanTerbaru, setPengumumanTerbaru] = useState<Pengumuman[]>([]);
  const [programs, setPrograms] = useState<ProgramUnggulan[]>([]);
  const [selectedArtikel, setSelectedArtikel] = useState<Pengumuman | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const {
      data: pengumuman
    } = await supabase.from("pengumuman").select("*").order("tanggal", {
      ascending: false
    }).limit(3);
    const {
      data: programsData
    } = await supabase.from("programs").select("*").eq("is_active", true).order("urutan", {
      ascending: true
    });
    if (pengumuman) setPengumumanTerbaru(pengumuman);
    if (programsData) setPrograms(programsData);
  };
  const filteredArtikel = pengumumanTerbaru.filter(item => item.judul.toLowerCase().includes(searchQuery.toLowerCase()));

  // Detail View for Artikel
  if (selectedArtikel) {
    return <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <div className="flex-1">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-[#4a1d5f] via-[#7b2d8e] to-[#c2469d] py-12 overflow-hidden">
            <div className="absolute inset-0 islamic-pattern opacity-10"></div>
            <div className="w-full px-4 md:px-8 lg:px-12 relative z-10">
              <button onClick={() => setSelectedArtikel(null)} className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4">
                <ArrowLeft className="h-5 w-5" />
                Kembali ke Beranda
              </button>
            </div>
          </section>

          {/* Content */}
          <section className="py-12 md:py-16 bg-background">
            <div className="w-full px-4 md:px-8 lg:px-12">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Sidebar */}
                  <div className="lg:col-span-4 order-2 lg:order-1">
                    {/* Search */}
                    <div className="mb-8">
                      <div className="relative">
                        <Input placeholder="Cari Artikel..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pr-12" />
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
                        {filteredArtikel.filter(a => a.id !== selectedArtikel.id).slice(0, 6).map(item => <button key={item.id} onClick={() => setSelectedArtikel(item)} className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary">
                            {item.judul}
                          </button>)}
                      </div>
                    </div>

                    {/* CTA Box */}
                    <Card className="mt-8 bg-primary text-primary-foreground border-0">
                      <CardContent className="p-6">
                        <h4 className="text-xl font-bold mb-4">Hubungi Kami</h4>
                        <p className="text-primary-foreground/80 text-sm mb-4">
                          Untuk informasi lebih lanjut tentang program dan pendaftaran santri baru.
                        </p>
                        <a href="/kontak" className="inline-block w-full text-center py-2 bg-background text-foreground rounded-lg font-medium hover:bg-background/90 transition-colors">
                          Kontak Kami
                        </a>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Main Content */}
                  <div className="lg:col-span-8 order-1 lg:order-2">
                    {/* Featured Image */}
                    {selectedArtikel.gambar_url ? <div className="rounded-xl overflow-hidden mb-8 aspect-video bg-muted">
                        <img src={selectedArtikel.gambar_url} alt={selectedArtikel.judul} className="w-full h-full object-cover" />
                      </div> : <div className="rounded-xl aspect-video bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center mb-8">
                        <Bell className="w-24 h-24 text-primary/30" />
                      </div>}

                    {/* Title & Content */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedArtikel.tanggal).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
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
      </div>;
  }
  return <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section - Matching Brochure Style */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary-light/5">
        {/* Shader Background */}
        <ShaderBackground />
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40" style={{
        zIndex: 1
      }} />
        {/* Background Pattern */}
        <div className="absolute inset-0 islamic-pattern opacity-20" style={{
        zIndex: 2
      }} />
        
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" style={{
        zIndex: 1
      }} />
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-accent/10 rounded-full blur-3xl" style={{
        zIndex: 1
      }} />
        
        <div className="w-full px-4 md:px-8 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left animate-fade-in">
              
              <div className="badge-primary mb-6" style={{
              textShadow: '1px 1px 4px rgba(0,0,0,0.8)'
            }}>
                <Sparkles className="w-4 h-4" />
                <span>Kawasan Wakaf Produktif</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{
              textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)'
            }}>
                <span className="text-gradient">BAITUL WAQOF</span>
                <br />
                <span className="text-gradient">MUNZALAN</span>
                <br />
                <span className="text-primary-light text-3xl md:text-4xl">INDONESIA</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-primary font-medium mb-4 italic" style={{
              textShadow: '1px 1px 6px rgba(0,0,0,0.8), 0 0 15px rgba(0,0,0,0.6)'
            }}>
                "Jembatan Amal Sholeh dari Orang Baik untuk Orang Baik"
              </p>
              
              <p className="text-muted-foreground mb-4 max-w-xl mx-auto lg:mx-0" style={{
              textShadow: '1px 1px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.7)',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
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
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-primary shadow-lg hover:shadow-2xl transition-all duration-300 px-6">
                    Hubungi Kami
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right Content - Circular Images */}
            <div className="hidden lg:block relative animate-scale-in">
              <div className="relative w-full h-[500px]">
                {/* Main large circle */}
                <CircleImage src={hero1} alt="Kegiatan KWP" size="xl" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20" />
                {/* Smaller circles around */}
                <CircleImage src={hero2} alt="Kegiatan 2" size="lg" borderColor="accent" className="absolute top-0 left-0 z-10" />
                <CircleImage src={hero3} alt="Kegiatan 3" size="md" className="absolute top-10 right-10 z-10" />
                <CircleImage src={hero4} alt="Kegiatan 4" size="lg" borderColor="accent" className="absolute bottom-0 right-0 z-10" />
                <CircleImage src={hero5} alt="Kegiatan 5" size="md" className="absolute bottom-10 left-10 z-10" />
              </div>
            </div>
          </div>
        </div>
        
        <WaveDivider className="absolute bottom-0 left-0 right-0" variant="white" />
      </section>

      {/* CTA Banner */}
      <section className="py-12 mb-8 bg-gradient-to-r from-[#4a1d5f] via-[#7b2d8e] to-[#c2469d] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="w-full px-4 md:px-8 lg:px-12 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2 animate-fade-in">
            Yuk, Jadi Bagian dari Gerakan Kebaikan Ini!
          </h2>
          <p className="text-primary-foreground/80 mb-4">Jangan bosan jadi orang baik</p>
          <Link to="/kontak">
            <Button size="lg" className="shadow-elegant hover:scale-110 transition-all duration-300 px-8 py-6 text-lg bg-white text-primary hover:opacity-90">
              Bergabung Sekarang
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 bg-background">
        <div className="w-full px-4 md:px-8 lg:px-12">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {programs.map((program, index) => {
            const IconComponent = iconMap[program.icon_name] || Heart;
            const colorClass = colorClasses[index % colorClasses.length];
            return <Card key={program.id} className="group card-hover border-0 shadow-lg hover:shadow-2xl bg-card animate-fade-in overflow-hidden transition-all duration-300 hover:-translate-y-1" style={{
              animationDelay: `${index * 100}ms`
            }}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-full ${colorClass} flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-bold text-foreground mb-1">{program.nama}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{program.subtitle}</p>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>
      </section>

      <WaveDividerSimple variant="muted" />

      {/* Facilities Section */}
      <section className="py-20 bg-muted/30">
        <div className="w-full px-4 md:px-8 lg:px-12">
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
            {facilities.map((facility, index) => <Card key={facility.title} className="group card-hover border-0 shadow-lg hover:shadow-2xl overflow-hidden animate-fade-in transition-all duration-300 hover:-translate-y-2" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <div className="aspect-square overflow-hidden">
                  <img src={facility.image} alt={facility.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto -mt-9 mb-2 rounded-full gradient-primary flex items-center justify-center shadow-elegant relative z-10">
                    <facility.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-bold text-foreground">{facility.title}</h3>
                  <p className="text-sm text-muted-foreground">{facility.description}</p>
                </CardContent>
              </Card>)}
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
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">
            {/* Vision */}
            <Card className="border-0 shadow-elegant overflow-hidden animate-fade-in flex flex-col h-full">
              <div className="gradient-primary p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">VISI</h3>
                </div>
              </div>
              <CardContent className="p-6 flex-1 flex items-center">
                <p className="text-muted-foreground leading-relaxed">
                  Menjadi lembaga sosial keummatan berbasis Masjid terbaik di Indonesia yang 
                  <span className="text-primary font-semibold"> amanah, profesional dan transparan </span>
                  berbasis ketaqwaan dan keberjama'ahan.
                </p>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className="border-0 shadow-elegant overflow-hidden animate-fade-in delay-200 flex flex-col h-full">
              <div className="gradient-accent p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">MISI</h3>
                </div>
              </div>
              <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-center">
                {["Menghadirkan semangat kebersamaan, kepedulian, kasih sayang untuk memuliakan, melayani, membahagiakan sahabat yatim, penghafal Al-Qur'an, mustahiq dan fii sabilillah.", "Melaksanakan gerakan dakwah bil hal dengan mengkampanyekan seruan \"Jangan Bosan Jadi Orang Baik\".", "Membentuk, mendidik dan memberdayakan santri PASKAS sebagai jembatan amal sholeh."].map((misi, index) => <div key={index} className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{misi}</p>
                  </div>)}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Wakaf Section */}
      <section className="py-20 bg-gradient-to-r from-[#4a1d5f] via-[#7b2d8e] to-[#c2469d] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="w-full px-4 md:px-8 lg:px-12 relative z-10">
          {/* Header */}
          <div className="mb-12 animate-fade-in">
            <div className="inline-block px-4 py-2 bg-white/20 text-white text-sm font-semibold rounded mb-6">
              KENAPA WAKAF
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-2xl">
              Wakaf di Baitul Wakaf Munzalan, Kebaikan Berkelanjutan
            </h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {wakafReasons.map((reason, index) => <div key={index} className="relative p-6 pt-8 rounded-2xl bg-primary-dark/60 backdrop-blur-sm border-2 border-white/20 hover:bg-primary-dark/80 hover:border-white/40 transition-all duration-300 animate-fade-in shadow-lg hover:shadow-2xl" style={{
            animationDelay: `${index * 100}ms`
          }}>
                {/* Number Badge */}
                <div className="absolute -top-4 right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <h3 className="text-white font-bold text-lg mb-3">{reason.text.split(' ').slice(0, 3).join(' ')}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{reason.text}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Artikel Terbaru */}
      <section className="py-20 bg-muted/30">
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="text-center mb-16 animate-fade-in">
            <div className="badge-accent mb-4 mx-auto">
              <Sparkles className="w-4 h-4" />
              <span>Artikel Terkini</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Artikel Terbaru</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Artikel dan informasi terbaru untuk seluruh keluarga besar KWP Munzalan
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pengumumanTerbaru.map((item, index) => <Card key={item.id} className="group bg-card border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-xl overflow-hidden cursor-pointer animate-fade-in" style={{
              animationDelay: `${index * 100}ms`
            }} onClick={() => setSelectedArtikel(item)}>
                  {/* Image */}
                  <div className="p-4 pb-0">
                    {item.gambar_url ? <div className="rounded-xl aspect-[4/3] bg-muted overflow-hidden">
                        <img src={item.gambar_url} alt={item.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div> : <div className="rounded-xl aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary-light/10 flex items-center justify-center">
                        <Bell className="w-16 h-16 text-primary/40" />
                      </div>}
                  </div>
                  
                  {/* Content Section */}
                  <CardContent className="p-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
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
                </Card>)}
            </div>
          </div>

          <div className="text-center mt-12 animate-fade-in delay-500">
            <Link to="/artikel">
              <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Lihat Semua Artikel
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
}