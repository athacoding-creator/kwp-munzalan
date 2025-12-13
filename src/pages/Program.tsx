import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WaveDivider } from "@/components/WaveDivider";
import { Heart, BookOpen, Users, Moon, Calendar, MapPin } from "lucide-react";

interface ProgramData {
  id: string;
  nama_kegiatan: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string | null;
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

export default function Program() {
  const [kegiatan, setKegiatan] = useState<ProgramData[]>([]);
  const [programs, setPrograms] = useState<ProgramUnggulan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    
    const { data: kegiatanData } = await supabase
      .from("kegiatan")
      .select("*")
      .order("tanggal", { ascending: false });
    
    const { data: programsData } = await supabase
      .from("programs")
      .select("*")
      .eq("is_active", true)
      .order("urutan", { ascending: true });
    
    if (kegiatanData) setKegiatan(kegiatanData);
    if (programsData) setPrograms(programsData);
    setIsLoading(false);
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
                Program Kami
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                Berbagai program kegiatan untuk pengembangan spiritual dan pemberdayaan umat
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <WaveDivider variant="white" />
          </div>
        </section>

        {/* Program Unggulan Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Program Unggulan
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Program-program rutin yang diselenggarakan untuk memberdayakan jamaah dan masyarakat
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {programs.map((program, index) => {
                const IconComponent = iconMap[program.icon_name] || Heart;
                return (
                  <Card 
                    key={program.id}
                    className="group border-0 shadow-elegant overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="gradient-primary p-6">
                      <div className="w-14 h-14 mb-4 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <IconComponent className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg text-foreground mb-1">{program.nama}</h3>
                      <p className="text-sm text-primary font-medium mb-3">{program.subtitle}</p>
                      {program.deskripsi && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{program.deskripsi}</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <WaveDivider variant="muted" />

        {/* Kegiatan Terjadwal Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Kegiatan Terjadwal
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Kegiatan-kegiatan khusus yang dijadwalkan oleh pengurus KWP Munzalan
              </p>
            </div>

            {isLoading ? (
              <div className="max-w-4xl mx-auto space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-card rounded-xl animate-pulse" />
                ))}
              </div>
            ) : kegiatan.length > 0 ? (
              <div className="max-w-4xl mx-auto space-y-6">
                {kegiatan.map((item, index) => (
                  <Card 
                    key={item.id} 
                    className="group border-0 shadow-elegant overflow-hidden hover:shadow-2xl transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {new Date(item.tanggal).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {item.nama_kegiatan}
                          </h3>
                          {item.lokasi && (
                            <div className="flex items-center text-muted-foreground mb-3">
                              <MapPin className="h-4 w-4 mr-2 text-primary" />
                              <span className="text-sm">{item.lokasi}</span>
                            </div>
                          )}
                          <p className="text-muted-foreground leading-relaxed">{item.deskripsi}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <Card className="border-0 shadow-elegant">
                  <CardContent className="p-12 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">
                      Belum Ada Kegiatan Terjadwal
                    </h3>
                    <p className="text-muted-foreground">
                      Kegiatan khusus akan ditampilkan di sini ketika dijadwalkan
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
