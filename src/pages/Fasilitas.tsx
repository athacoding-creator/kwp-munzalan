import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface FasilitasData {
  id: string;
  nama: string;
  deskripsi: string;
  foto_url: string | null;
}

export default function Fasilitas() {
  const [fasilitas, setFasilitas] = useState<FasilitasData[]>([]);

  useEffect(() => {
    fetchFasilitas();
  }, []);

  const fetchFasilitas = async () => {
    const { data } = await supabase.from("fasilitas").select("*").order("created_at", { ascending: false });
    if (data) setFasilitas(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Header */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5 islamic-pattern">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Fasilitas</h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Berbagai fasilitas lengkap untuk mendukung pembelajaran dan kegiatan santri
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fasilitas.map((item) => (
                <Card key={item.id} className="shadow-soft border-0 overflow-hidden hover:shadow-elegant transition-smooth">
                  {item.foto_url && (
                    <img
                      src={item.foto_url}
                      alt={item.nama}
                      className="w-full object-contain"
                    />
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-primary">{item.nama}</h3>
                    <p className="text-muted-foreground">{item.deskripsi}</p>
                  </CardContent>
                </Card>
              ))}

              {fasilitas.length === 0 && (
                <div className="col-span-full">
                  <Card className="shadow-soft border-0">
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground">Informasi fasilitas akan segera tersedia.</p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
