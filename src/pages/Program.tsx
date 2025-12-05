import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WaveDivider, WaveDividerSimple } from "@/components/WaveDivider";
import { Heart, BookOpen, Users, Moon, Sparkles, Calendar, MapPin } from "lucide-react";

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

const colorClasses = [
  "from-primary to-primary-light",
  "from-primary-light to-accent", 
  "from-accent to-primary",
  "from-primary to-accent",
];

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

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 islamic-pattern opacity-50" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="badge-primary mb-6 mx-auto">
              <BookOpen className="w-4 h-4" />
              <span>Program Unggulan</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-gradient">PROGRAM</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Berbagai program kegiatan yang dirancang untuk pengembangan spiritual, 
              pendidikan, dan pemberdayaan umat di KWP Munzalan
            </p>
          </div>
        </div>
        
        <WaveDivider className="absolute bottom-0 left-0 right-0" variant="white" />
      </section>

      {/* Program Unggulan Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="badge-accent mb-4 mx-auto">
              <Sparkles className="w-4 h-4" />
              <span>Program Tetap</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient">Program Unggulan Kami</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Program-program rutin yang diselenggarakan untuk memberdayakan jamaah dan masyarakat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((program, index) => {
              const IconComponent = iconMap[program.icon_name] || Heart;
              const colorClass = colorClasses[index % colorClasses.length];
              return (
                <Card 
                  key={program.id}
                  className="group border-0 shadow-card overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`h-2 bg-gradient-to-r ${colorClass}`} />
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 mb-4 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-1">{program.nama}</h3>
                    <p className="text-sm text-primary font-medium mb-3">{program.subtitle}</p>
                    {program.deskripsi && (
                      <p className="text-sm text-muted-foreground">{program.deskripsi}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <WaveDividerSimple variant="muted" />

      {/* Kegiatan Terjadwal Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="badge-primary mb-4 mx-auto">
              <Calendar className="w-4 h-4" />
              <span>Jadwal Kegiatan</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient">Kegiatan Terjadwal</span>
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
                  className="group border-0 shadow-card overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20">
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
                        <p className="text-muted-foreground">{item.deskripsi}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto border-0 shadow-card">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Belum ada kegiatan terjadwal</h3>
                <p className="text-muted-foreground">
                  Kegiatan khusus akan ditampilkan di sini ketika dijadwalkan
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <WaveDividerSimple flip variant="muted" />

      {/* CTA Section */}
      <section className="py-20 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ikuti Program Kami
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Bergabunglah dalam berbagai program pemberdayaan di KWP Munzalan. 
            Jadilah bagian dari gerakan kebaikan yang berkelanjutan.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}