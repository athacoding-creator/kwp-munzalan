import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Header */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5 islamic-pattern">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Profil Lembaga</h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Mengenal lebih dekat KWP Munzalan, sejarah, visi misi, dan nilai-nilai yang kami junjung tinggi
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {profil.map((item) => (
                <Card key={item.id} className="shadow-soft border-0 overflow-hidden">
                  {item.foto_profil_url && (
                    <img
                      src={item.foto_profil_url}
                      alt={item.judul}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4 text-primary">{item.judul}</h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground whitespace-pre-wrap">
                      {item.konten}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {profil.length === 0 && (
                <Card className="shadow-soft border-0">
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">Informasi profil akan segera tersedia.</p>
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
