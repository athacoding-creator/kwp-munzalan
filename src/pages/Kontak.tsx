import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MapPin, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Kontak() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    pesan: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Pesan terkirim!",
      description: "Terima kasih, kami akan segera menghubungi Anda.",
    });
    setFormData({ nama: "", email: "", pesan: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Header */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5 islamic-pattern">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Hubungi Kami</h1>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Silakan hubungi kami untuk informasi lebih lanjut atau jika ada pertanyaan
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Info */}
              <div className="space-y-8">
                <Card className="shadow-soft border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Alamat</h3>
                        <p className="text-muted-foreground">
                          Kebun Lor, Argomulyo<br />
                          Kabupaten Sleman<br />
                          Daerah Istimewa Yogyakarta 55583
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Telepon</h3>
                        <p className="text-muted-foreground">
                          +62 811-2999-211<br />
                          +62 822-4159-0417
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Email</h3>
                        <p className="text-muted-foreground">
                          info@kwpmunzalan.com<br />
                          admin@kwpmunzalan.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <Card className="shadow-soft border-0">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold mb-6">Kirim Pesan</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="nama">Nama Lengkap</Label>
                      <Input
                        id="nama"
                        value={formData.nama}
                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pesan">Pesan</Label>
                      <Textarea
                        id="pesan"
                        value={formData.pesan}
                        onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                        required
                        rows={6}
                        className="mt-1"
                      />
                    </div>
                    <Button type="submit" className="w-full gradient-primary text-primary-foreground shadow-elegant">
                      Kirim Pesan
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
