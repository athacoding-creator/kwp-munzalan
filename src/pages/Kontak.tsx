import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WaveDivider } from "@/components/WaveDivider";
import { MapPin, Phone, Mail, Clock, ExternalLink, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Contact info data
const contactInfo = [
  {
    icon: MapPin,
    title: "Alamat",
    details: ["Kebun Lor, Argomulyo", "Kec. Cangkringan, Kab. Sleman", "DIY 55583"],
  },
  {
    icon: Phone,
    title: "Telepon",
    details: ["+62 811-2999-211", "+62 878-3964-3782"],
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@kwpmunzalan.com", "admin@kwpmunzalan.com"],
  },
];

export default function Kontak() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    subjek: "",
    pesan: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Pesan terkirim!",
      description: "Terima kasih, kami akan segera menghubungi Anda.",
    });
    setFormData({ nama: "", email: "", subjek: "", pesan: "" });
    setIsSubmitting(false);
  };

  const googleMapsUrl = "https://www.google.com/maps/place/KWP+Masjid+Kapal+Munzalan+Yogyakarta/@-7.6729533,110.4527409,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7a5d350e02aa25:0xaecedf1459aac1c3!8m2!3d-7.6729533!4d110.4527409!16s%2Fg%2F11svnf_f8r?entry=ttu&g_ep=EgoyMDI1MTIwMi4wIKXMDSoASAFQAw%3D%3D";
  const embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.3874837584845!2d110.45016091477402!3d-7.672953376808891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5d350e02aa25%3A0xaecedf1459aac1c3!2sKWP%20Masjid%20Kapal%20Munzalan%20Yogyakarta!5e0!3m2!1sen!2sid!4v1733216000000!5m2!1sen!2sid";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-r from-[#4a1d5f] via-[#7b2d8e] to-[#c2469d] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-60 h-60 bg-white rounded-full blur-3xl" />
          </div>
          
          <div className="w-full px-4 md:px-8 lg:px-12 relative z-10">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="badge-primary bg-white/20 text-white mb-6 mx-auto">
                <Phone className="h-4 w-4" />
                <span>Hubungi Kami</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Mari <span className="text-white">Terhubung</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed">
                Kami siap membantu Anda. Silakan hubungi kami untuk informasi lebih lanjut 
                tentang program, wakaf, atau pertanyaan lainnya.
              </p>
            </div>
          </div>
          
          <WaveDivider className="absolute bottom-0 left-0 right-0" variant="white" />
        </section>

        {/* Google Maps Section */}
        <section className="py-12 md:py-16 bg-background">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Lokasi Kami</h2>
              <p className="text-muted-foreground">Kunjungi kami di alamat berikut</p>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-elegant border border-border/50">
              <iframe
                src={embedUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi KWP Munzalan"
                className="w-full"
              />
              
              <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto">
                <Button
                  asChild
                  className="w-full md:w-auto gradient-primary text-white shadow-elegant gap-2 hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Buka di Google Maps
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {contactInfo.map((info, index) => (
                <Card 
                  key={info.title}
                  className="group card-hover border-0 shadow-soft animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                      <info.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-3">{info.title}</h3>
                    <div className="space-y-1">
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-muted-foreground text-sm">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Operating Hours */}
        <section className="py-12 md:py-16 bg-background">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-elegant overflow-hidden">
                  <CardContent className="p-0">
                    <div className="gradient-primary p-6">
                      <h2 className="text-2xl font-bold text-primary-foreground">Kirim Pesan</h2>
                      <p className="text-primary-foreground/80 mt-1">
                        Isi formulir di bawah dan kami akan segera merespons
                      </p>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <Label htmlFor="nama" className="text-foreground">Nama Lengkap</Label>
                          <Input
                            id="nama"
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            required
                            placeholder="Masukkan nama Anda"
                            className="mt-1.5"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-foreground">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            placeholder="contoh@email.com"
                            className="mt-1.5"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="subjek" className="text-foreground">Subjek</Label>
                        <Input
                          id="subjek"
                          value={formData.subjek}
                          onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                          required
                          placeholder="Topik pesan Anda"
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pesan" className="text-foreground">Pesan</Label>
                        <Textarea
                          id="pesan"
                          value={formData.pesan}
                          onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                          required
                          rows={5}
                          placeholder="Tulis pesan Anda di sini..."
                          className="mt-1.5 resize-none"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full gradient-primary text-white shadow-elegant gap-2 hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Kirim Pesan
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Operating Hours */}
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <h3 className="font-bold text-lg text-foreground">Jam Operasional</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Senin - Jumat</span>
                        <span className="font-medium text-foreground">08:00 - 16:00</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-border/50">
                        <span className="text-muted-foreground">Sabtu</span>
                        <span className="font-medium text-foreground">08:00 - 12:00</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground">Minggu</span>
                        <span className="font-medium text-destructive">Tutup</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Contact */}
                <Card className="border-0 shadow-soft gradient-primary overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                      <MessageCircle className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-bold text-white mb-2">Butuh Bantuan Cepat?</h3>
                    <p className="text-sm text-white/80 mb-4">
                      Hubungi kami langsung via WhatsApp untuk respons lebih cepat
                    </p>
                    <Button
                      asChild
                      className="w-full gradient-primary text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
                    >
                      <a 
                        href="https://wa.me/628112999211" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Chat WhatsApp
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
