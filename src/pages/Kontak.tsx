import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, Phone, Mail, Clock, ExternalLink, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Wave divider component
const WaveDivider = ({ flip = false, className = "" }: { flip?: boolean; className?: string }) => (
  <div className={`w-full overflow-hidden ${flip ? 'rotate-180' : ''} ${className}`}>
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="w-full h-16 md:h-24"
    >
      <path
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
        fill="hsl(var(--primary))"
        opacity="0.15"
      />
      <path
        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
        fill="hsl(var(--primary))"
        opacity="0.25"
      />
      <path
        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
        fill="hsl(var(--primary))"
        opacity="0.35"
      />
    </svg>
  </div>
);

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
    details: ["+62 811-2999-211", "+62 822-4159-0417"],
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
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Pesan terkirim!",
      description: "Terima kasih, kami akan segera menghubungi Anda.",
    });
    setFormData({ nama: "", email: "", subjek: "", pesan: "" });
    setIsSubmitting(false);
  };

  const googleMapsUrl = "https://www.google.com/maps/place/Kebun+Lor,+Argomulyo,+Kec.+Cangkringan,+Kabupaten+Sleman,+Daerah+Istimewa+Yogyakarta+55583";
  const embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15812.482714044548!2d110.44!3d-7.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5d05f5e01c8d%3A0x1234567890abcdef!2sKebun%20Lor%2C%20Argomulyo%2C%20Cangkringan%2C%20Sleman%2C%20DIY!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary/10 via-primary/5 to-background overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Phone className="h-4 w-4" />
                <span>Hubungi Kami</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Mari <span className="text-primary">Terhubung</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Kami siap membantu Anda. Silakan hubungi kami untuk informasi lebih lanjut 
                tentang pendaftaran, program, atau pertanyaan lainnya.
              </p>
            </div>
          </div>
          
          <WaveDivider className="absolute bottom-0 left-0 right-0" />
        </section>

        {/* Google Maps Section */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
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
              
              {/* Overlay with button */}
              <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto">
                <Button
                  asChild
                  className="w-full md:w-auto gradient-primary text-primary-foreground shadow-elegant gap-2"
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

        <WaveDivider flip className="bg-muted/30" />

        {/* Contact Info Cards */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {contactInfo.map((info, index) => (
                <Card 
                  key={info.title}
                  className="group border-0 shadow-soft hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                      <info.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-3">{info.title}</h3>
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
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
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
                        className="w-full gradient-primary text-primary-foreground shadow-elegant gap-2"
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

              {/* Operating Hours */}
              <div className="space-y-6">
                <Card className="border-0 shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">Jam Operasional</h3>
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
                <Card className="border-0 shadow-soft bg-primary/5">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-foreground mb-2">Butuh Bantuan Cepat?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Hubungi kami langsung via WhatsApp untuk respons lebih cepat
                    </p>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
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
