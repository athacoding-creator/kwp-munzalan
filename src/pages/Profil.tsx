import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WaveDivider } from "@/components/WaveDivider";
import { CircleImage } from "@/components/CircleImage";
import { Target, Eye, BookOpen, Heart, Users, Sparkles } from "lucide-react";

interface ProfilData {
  id: string;
  judul: string;
  konten: string;
  foto_profil_url: string | null;
}

export default function Profil() {
  const [profil, setProfil] = useState<ProfilData[]>([]);

  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    const { data } = await supabase.from("profil").select("*");
    if (data) setProfil(data);
  };

  const visiMisi = {
    visi: "Menjadi lembaga wakaf produktif yang unggul dalam pengelolaan aset wakaf untuk kesejahteraan umat dan pengembangan pendidikan Islam yang berkualitas.",
    misi: [
      "Mengelola aset wakaf secara profesional, transparan, dan amanah",
      "Mengembangkan program-program produktif yang berkelanjutan",
      "Memberikan pendidikan Al-Qur'an berkualitas untuk semua kalangan",
      "Membangun fasilitas yang mendukung kegiatan dakwah dan pendidikan",
      "Memberdayakan masyarakat melalui program-program sosial dan ekonomi",
    ],
  };

  const nilaiValues = [
    {
      icon: Heart,
      title: "Amanah",
      description: "Menjaga kepercayaan wakif dengan pengelolaan yang transparan",
    },
    {
      icon: Users,
      title: "Profesional",
      description: "Bekerja dengan standar tinggi dan akuntabilitas",
    },
    {
      icon: BookOpen,
      title: "Bermanfaat",
      description: "Memberikan manfaat nyata bagi umat dan masyarakat",
    },
    {
      icon: Sparkles,
      title: "Berkelanjutan",
      description: "Program yang terus berkembang dan memberikan dampak jangka panjang",
    },
  ];

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
                Profil Lembaga
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                Mengenal lebih dekat KWP Munzalan, sejarah, visi misi, dan nilai-nilai yang kami junjung tinggi
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <WaveDivider variant="white" />
          </div>
        </section>

        {/* Visi Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">Visi</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {visiMisi.visi}
                  </p>
                </div>
                <div className="order-1 md:order-2 flex justify-center">
                  <CircleImage
                    src="/placeholder.svg"
                    alt="Visi KWP Munzalan"
                    size="lg"
                    className="shadow-elegant"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <WaveDivider variant="muted" />

        {/* Misi Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center">
                  <CircleImage
                    src="/placeholder.svg"
                    alt="Misi KWP Munzalan"
                    size="lg"
                    className="shadow-elegant"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">Misi</h2>
                  </div>
                  <ul className="space-y-4">
                    {visiMisi.misi.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground leading-relaxed pt-1">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <WaveDivider variant="muted" flip />

        {/* Nilai-Nilai Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Nilai-Nilai Kami
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Prinsip-prinsip yang menjadi landasan dalam setiap langkah pengelolaan wakaf
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {nilaiValues.map((nilai, index) => (
                <Card 
                  key={index} 
                  className="card-hover border-0 shadow-soft bg-card text-center group"
                >
                  <CardContent className="p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <nilai.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">{nilai.title}</h3>
                    <p className="text-sm text-muted-foreground">{nilai.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic Profile Content from Database */}
        {profil.length > 0 && (
          <>
            <WaveDivider variant="muted" />
            <section className="py-16 md:py-20 bg-muted/30">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                    Informasi Lembaga
                  </h2>
                </div>
                <div className="max-w-4xl mx-auto space-y-12">
                  {profil.map((item, index) => (
                    <Card 
                      key={item.id} 
                      className="shadow-soft border-0 overflow-hidden bg-card"
                    >
                      <div className={`grid md:grid-cols-2 gap-0 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                        {item.foto_profil_url && (
                          <div className={`relative h-64 md:h-auto ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                            <img
                              src={item.foto_profil_url}
                              alt={item.judul}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </div>
                        )}
                        <CardContent className={`p-8 flex flex-col justify-center ${!item.foto_profil_url ? 'md:col-span-2' : ''}`}>
                          <h3 className="text-2xl font-bold mb-4 text-primary">{item.judul}</h3>
                          <div className="prose prose-lg max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {item.konten}
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Empty State */}
        {profil.length === 0 && (
          <>
            <WaveDivider variant="muted" />
            <section className="py-16 bg-muted/30">
              <div className="container mx-auto px-4">
                <Card className="shadow-soft border-0 max-w-2xl mx-auto">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground">
                      Informasi profil tambahan akan segera tersedia.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
