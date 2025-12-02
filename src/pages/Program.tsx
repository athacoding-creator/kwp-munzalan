import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar, MapPin } from "lucide-react";

interface ProgramData {
  id: string;
  nama_kegiatan: string;
  deskripsi: string;
  tanggal: string;
  lokasi: string | null;
}

export default function Program() {
  const [program, setProgram] = useState<ProgramData[]>([]);

  useEffect(() => {
    fetchProgram();
  }, []);

  const fetchProgram = async () => {
    const { data } = await supabase.from("kegiatan").select("*").order("tanggal", { ascending: false });
    if (data) setProgram(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Header */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5 islamic-pattern">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Program</h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Program dan kegiatan yang dirancang untuk pengembangan spiritual dan karakter santri
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {program.map((item) => (
                <Card key={item.id} className="shadow-soft border-0 hover:shadow-elegant transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-shrink-0">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(item.tanggal).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-2">{item.nama_kegiatan}</h3>
                        {item.lokasi && (
                          <div className="flex items-center text-muted-foreground mb-3">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{item.lokasi}</span>
                          </div>
                        )}
                        <p className="text-muted-foreground">{item.deskripsi}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {program.length === 0 && (
                <Card className="shadow-soft border-0">
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">Belum ada program yang dijadwalkan.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
