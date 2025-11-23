import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Calendar } from "lucide-react";

interface PengumumanData {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
}

export default function Pengumuman() {
  const [pengumuman, setPengumuman] = useState<PengumumanData[]>([]);

  useEffect(() => {
    fetchPengumuman();
  }, []);

  const fetchPengumuman = async () => {
    const { data } = await supabase.from("pengumuman").select("*").order("tanggal", { ascending: false });
    if (data) setPengumuman(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Header */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5 islamic-pattern">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Pengumuman</h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Informasi terkini dan pengumuman penting untuk santri dan orang tua
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {pengumuman.map((item) => (
                <Card key={item.id} className="shadow-soft border-0 hover:shadow-elegant transition-smooth">
                  <CardContent className="p-6">
                    <Badge className="bg-accent/10 text-accent-foreground hover:bg-accent/20 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(item.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Badge>
                    <h3 className="text-2xl font-semibold mb-4">{item.judul}</h3>
                    <div className="prose prose-lg max-w-none text-muted-foreground whitespace-pre-wrap">
                      {item.isi}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {pengumuman.length === 0 && (
                <Card className="shadow-soft border-0">
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">Belum ada pengumuman terbaru.</p>
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
