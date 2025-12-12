import { useState, useEffect } from "react";
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


// Import images
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";
import hero4 from "@/assets/hero-4.jpg";
import hero5 from "@/assets/hero-5.jpg";
// Using hero images for facilities
const masjid = hero2;
const greenhouse = hero3;
const guesthouse = hero4;
const perikanan = hero5;

const Home = () => {
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(2);

      if (error) {
        console.error('Error fetching articles:', error);
      } else {
        setArticles(data || []);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const programs = [
    {
      icon: Heart,
      title: "MMP",
      description: "Mustahiq Mengaji Peduli",
      color: "gradient-primary"
    },
    {
      icon: BookOpen,
      title: "Tahsin Warga",
      description: "Perbaikan Bacaan Al-Quran",
      color: "gradient-primary"
    },
    {
      icon: BookOpen,
      title: "Kelas Iqro' Warga",
      description: "Belajar Iqro' untuk Warga",
      color: "gradient-primary"
    },
    {
      icon: BookOpen,
      title: "Kelas Quran Warga",
      description: "Pengajian Al-Quran Rutin",
      color: "gradient-primary"
    },
    {
      icon: Users,
      title: "Kelas TPA Anak",
      description: "Pendidikan Agama Anak-anak",
      color: "gradient-primary"
    },
    {
      icon: Moon,
      title: "MUFASA",
      description: "Munzalan After Isya",
      color: "gradient-primary"
    },
    {
      icon: Heart,
      title: "Bekam Masal",
      description: "Kesehatan Gratis untuk Warga",
      color: "gradient-primary"
    },
    {
      icon: Users,
      title: "PASKAS",
      description: "Pasukan Amal Sholeh",
      color: "gradient-primary"
    },
  ];

  const facilities = [
    {
      icon: HomeIcon,
      title: "Masjid / Musholla",
      description: "Pusat ibadah dan kegiatan keagamaan",
      image: masjid
    },
    {
      icon: Leaf,
      title: "Green House",
      description: "Area pertanian produktif",
      image: greenhouse
    },
    {
      icon: HomeIcon,
      title: "Guest House",
      description: "Penginapan untuk tamu",
      image: guesthouse
    },
    {
      icon: Fish,
      title: "Perikanan",
      description: "Budidaya ikan produktif",
      image: perikanan
    }
  ];

  return <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section - Split Screen Design */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Left Side - Content with Gradient Background */}
        <div className="w-full lg:w-1/2 min-h-[90vh] flex items-center bg-gradient-to-br from-[#7A1F86] via-[#8B1D8F] to-[#1a0a2e] relative">
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 islamic-pattern opacity-5" />
          
          <div className="container mx-auto px-6 md:px-12 py-16 relative z-10">
            <div className="max-w-2xl animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
                <Sparkles className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-medium">Kawasan Wakaf Produktif</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                BAITUL WAQOF
                <br />
                <span className="text-purple-200">MUNZALAN</span>
                <br />
                <span className="text-3xl lg:text-4xl text-purple-100">INDONESIA</span>
              </h1>
              
              {/* Tagline */}
              <p className="text-xl md:text-2xl text-purple-100 font-medium mb-6 italic">
                "Jembatan Amal Sholeh dari Orang Baik untuk Orang Baik"
              </p>
              
              {/* Description */}
              <p className="text-white/90 text-lg mb-8 leading-relaxed">
                Kawasan Wakaf Produktif (KWP) adalah sebuah area yang dikelola secara amanah dan profesional 
                untuk menghadirkan manfaat berkelanjutan bagi masjid, jamaah, dan masyarakat.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/profil">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Jelajahi KWP
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/kontak">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-primary shadow-lg hover:shadow-2xl transition-all duration-300 font-semibold">
                    Hubungi Kami
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Hero Image */}
        <div className="hidden lg:block lg:w-1/2 min-h-[90vh] relative overflow-hidden">
          <img 
            src={hero1} 
            alt="KWP Munzalan" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient Overlay untuk blend dengan left side */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a2e]/30 to-transparent" />
        </div>
      </section>

      <WaveDivider />

      {/* CTA Section */}
      <section className="py-16 mb-16 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Yuk, Jadi Bagian dari Gerakan Kebaikan Ini!
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Jangan bosan jadi orang baik
          </p>
          <Link to="/kontak">
            <Button size="lg" className="gradient-primary text-white shadow-elegant hover:scale-110 transition-all duration-300 px-10 py-7 text-xl font-semibold hover:opacity-90">
              Bergabung Sekarang
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Program Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="badge-primary mb-4 inline-flex">
              <BookOpen className="w-4 h-4" />
              <span>Program Unggulan</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">PROGRAM</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Berbagai program kegiatan yang kami selenggarakan untuk memberdayakan umat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return <Card key={index} className="group hover:-translate-y-2 transition-all duration-300 shadow-md hover:shadow-xl border-none">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${program.color} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-foreground">{program.title}</h3>
                    <p className="text-muted-foreground">{program.description}</p>
                  </CardContent>
                </Card>;
            })}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="badge-primary mb-4 inline-flex">
              <HomeIcon className="w-4 h-4" />
              <span>Sarana & Prasarana</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">FASILITAS KWP</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fasilitas yang tersedia di Kawasan Wakaf Produktif Munzalan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((facility, index) => {
              const Icon = facility.icon;
              return <Card key={index} className="group overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="relative h-64 overflow-hidden">
                    <img src={facility.image} alt={facility.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-3 shadow-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-xl mb-2">{facility.title}</h3>
                    <p className="text-muted-foreground">{facility.description}</p>
                  </CardContent>
                </Card>;
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/fasilitas">
              <Button size="lg" className="gradient-primary text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                Lihat Semua Fasilitas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Vision Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-102">
              <div className="gradient-primary p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold">VISI</h3>
                </div>
                <p className="text-white/95 leading-relaxed text-lg" style={{ color: '#555' }}>
                  Menjadi lembaga sosial keummatan berbasis Masjid terbaik di Indonesia yang <span className="font-semibold text-white">amanah, profesional dan transparan</span> berbasis ketaqwaan dan keberjama'ahan.
                </p>
              </div>
            </Card>

            {/* Mission Card */}
            <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-102">
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gradient">MISI</h3>
                </div>
                <div className="space-y-4 text-gray-700">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="leading-relaxed" style={{ color: '#555' }}>
                      Menghadirkan semangat kebersamaan, kepedulian, kasih sayang untuk memuliakan, melayani, membahagiakan sahabat yatim, penghafal Al-Qur'an, mustahiq dan fii sabilillah.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="leading-relaxed" style={{ color: '#555' }}>
                      Melaksanakan gerakan dakwah bil hal dengan mengkampanyekan seruan <span className="font-semibold text-primary">"Jangan Bosan Jadi Orang Baik"</span>.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <p className="leading-relaxed" style={{ color: '#555' }}>
                      Membentuk, mendidik dan memberdayakan santri PASKAS sebagai jembatan amal sholeh.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Wakaf Section */}
      <section className="py-20 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="badge-primary mb-4 inline-flex bg-white/20 backdrop-blur-sm border-white/30">
              <Heart className="w-4 h-4 text-white" />
              <span className="text-white">KENAPA WAKAF</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Wakaf di Baitul Wakaf Munzalan, Kebaikan Berkelanjutan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              { number: "01", title: "Mendukung Gerakan Dakwah", subtitle: "Mendukung Gerakan Dakwah Kemasjidan" },
              { number: "02", title: "Dampak Berkelanjutan (Sadaqah", subtitle: "Dampak Berkelanjutan (Sadaqah Jariyah)" },
              { number: "03", title: "Menguatkan Ekosistem Peradaban", subtitle: "Menguatkan Ekosistem Peradaban" },
              { number: "04", title: "Diniatkan untuk Menghidupkan", subtitle: "Diniatkan untuk Menghidupkan Masjid & Umat" }
            ].map((item, index) => <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <CardContent className="p-6">
                  <div className="text-6xl font-bold text-white/30 mb-4">{item.number}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/80">{item.subtitle}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      <WaveDividerSimple />

      {/* Articles Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="badge-primary mb-4 inline-flex">
              <BookOpen className="w-4 h-4" />
              <span>Artikel Terkini</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">Artikel Terbaru</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Artikel dan informasi terbaru untuk seluruh keluarga besar KWP Munzalan
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {articles.map((article) => <Card key={article.id} className="overflow-hidden group hover:-translate-y-3 hover:shadow-2xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img src={article.image_url || "/placeholder.svg"} alt={article.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-2xl mb-3 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {article.content}
                  </p>
                  <Link to={`/artikel/${article.id}`} className="inline-flex items-center text-primary font-semibold hover:gap-3 transition-all">
                    SELENGKAPNYA
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>)}
          </div>

          <div className="text-center">
            <Link to="/artikel">
              <Button size="lg" className="gradient-primary text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                Lihat Semua Artikel
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>;
};

export default Home;
