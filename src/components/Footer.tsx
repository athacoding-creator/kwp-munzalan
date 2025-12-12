import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Heart, Instagram, Facebook, Youtube } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="w-full px-4 md:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Baitul Waqof</h3>
                <p className="text-sm text-background/70">Munzalan Indonesia</p>
              </div>
            </div>
            <p className="text-background/70 mb-4 text-sm" style={{lineHeight: '1.8'}}>
              Jembatan Amal Sholeh dari Orang Baik untuk Orang Baik.
            </p>
            <a 
              href="https://munzalan.id" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-primary hover:text-primary/80 transition-colors text-sm font-medium mb-6"
            >
              🏠 Kunjungi Munzalan.id - Pusat Informasi
            </a>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Menu</h4>
            <ul className="space-y-3">
              {[
                { to: "/", label: "Beranda" },
                { to: "/profil", label: "Profil" },
                { to: "/fasilitas", label: "Fasilitas" },
                { to: "/kegiatan", label: "Kegiatan" },
                { to: "/dokumentasi", label: "Dokumentasi" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-background/70 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a 
                  href="https://munzalan.id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-primary transition-colors"
                >
                  Munzalan.id
                </a>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-bold text-lg mb-6">Program</h4>
            <ul className="space-y-3 text-background/70 text-sm" style={{lineHeight: '1.8'}}>
              <li>MMP (Mustahiq Mengaji Peduli)</li>
              <li>Tahsin Warga</li>
              <li>Kelas Iqro' Warga</li>
              <li>Kelas TPA Anak-anak</li>
              <li>MUFASA</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-background/70 text-sm">Kebun Lor, Argomulyo, Cangkringan, Sleman, DIY</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-background/70 text-sm">+62 811-2999-211</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-background/70 text-sm">info@kwpmunzalan.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="w-full px-4 md:px-8 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">&copy; {currentYear} Baitul Waqof Munzalan Indonesia.</p>
            <p className="text-background/60 text-sm flex items-center gap-1">
              Dibuat dengan <Heart className="w-4 h-4 text-red-500 fill-red-500" /> untuk Umat
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
