import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Eye, Target, CheckCircle } from "lucide-react";

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

  // Visi & Misi content from brochure
  const visi = "Menjadi lembaga sosial keummatan berbasis Masjid terbaik di Indonesia yang amanah, profesional dan transparan berbasis ketaqwaan dan keberjama'ahan";
  
  const misi = [
    "Menghadirkan semangat kebersamaan, kepedulian, kasih sayang untuk memulakan, melayani, membahagiakan umat yatim, penghafal Al-Qur'an, mustahiq dan fil sabilillah agar semakin dekat dengan Allah dan Rasul-Nya.",
    "Melaksanakan gerakan dakwah bil hal dengan mengkampanyekan seruan \"Jangan Bosan Jadi Orang Baik\" dengan metode kreatif, inovatif dan edukatif.",
    "Membentuk, mendidik dan mengembangkan santri PASKAS (Pasukan Amal Sholeh) sebagai jembatan amal sholeh yang mempertemukan orang baik dengan orang perlu.",
    "Dengan terbentuknya santri PASKAS, BMI menjalankan fungsinya sebagai jembatan amal sholeh dan melakukan prinsip dasar dalam proses pendistribusian yaitu konsep \"Terima Kasih\" yaitu mengantarkan amanah terbaik dari orang baik untuk orang baik. Bersama-sama berusaha, berdoa untuk terwujudnya kemandirian, kesejahteraan, kepedulian orang-orang baik (Muzakki, Munfiq, Wakif) dan penerima manfaat (sahabat yatim, penghafal Qur'an, mustahiq dan fil sabilillah) melalui program ZISWAF agar semakin dekat kepada Allah dan Rasul-Nya"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-primary-light/5 overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-50" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Profil Lembaga
            </h1>
            <p className="text-xl text-muted-foreground">
              Mengenal lebih dekat Baitul Waqof Munzalan Indonesia
            </p>
          </div>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Visi Card */}
            <Card className="shadow-elegant border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-primary to-primary-light p-6">
                <div className="flex items-center justify-center gap-3">
                  <Eye className="h-8 w-8 text-white" />
                  <h2 className="text-3xl font-bold text-white">VISI</h2>
                </div>
              </div>
              <CardContent className="p-8">
                <p className="text-lg text-muted-foreground leading-relaxed text-center">
                  {visi}
                </p>
              </CardContent>
            </Card>

            {/* Misi Card */}
            <Card className="shadow-elegant border-0 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-primary to-primary-light p-6">
                <div className="flex items-center justify-center gap-3">
                  <Target className="h-8 w-8 text-white" />
                  <h2 className="text-3xl font-bold text-white">MISI</h2>
                </div>
              </div>
              <CardContent className="p-8">
                <ul className="space-y-4">
                  {misi.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <p className="text-muted-foreground leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Profile Content from Database */}
      {profil.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              {profil.map((item) => (
                <Card key={item.id} className="shadow-soft border-0 overflow-hidden hover:shadow-elegant transition-smooth">
                  {item.foto_profil_url && (
                    <div className="w-full aspect-video overflow-hidden">
                      <img
                        src={item.foto_profil_url}
                        alt={item.judul}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold mb-6 text-primary">{item.judul}</h2>
                    <div className="prose prose-lg max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {item.konten}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Kenapa Harus Wakaf Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Kenapa Harus Wakaf di Baitul Wakaf Munzalan Indonesia?</h2>
            </div>
            
            <Card className="shadow-elegant border-0">
              <CardContent className="p-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Wakaf Dikelola Secara Produktif</h3>
                      <p className="text-muted-foreground">Aset wakaf dikelola dengan profesional untuk menghasilkan manfaat berkelanjutan</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Mendukung Gerakan Dakwah Kemasjidan</h3>
                      <p className="text-muted-foreground">Kontribusi langsung untuk menghidupkan masjid dan kegiatan dakwah</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Dampak Berkelanjutan (Sadaqah Jariyah)</h3>
                      <p className="text-muted-foreground">Pahala terus mengalir selama manfaat wakaf masih dirasakan</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Menguatkan Ekosistem Peradaban</h3>
                      <p className="text-muted-foreground">Membangun infrastruktur sosial dan ekonomi berbasis masjid</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">Diniatkan untuk Menghidupkan Masjid & Umat</h3>
                      <p className="text-muted-foreground">Setiap wakaf ditujukan untuk kebangkitan masjid dan kesejahteraan umat</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
