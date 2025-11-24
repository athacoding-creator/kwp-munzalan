import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">K</span>
              </div>
              <span className="font-bold text-xl">KWP Munzalan</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Lembaga Islam yang berkomitmen pada Pusat kegiatan keagamaan, sosial, dan ekonomi yang terintegrasi dengan manajemen masjid yang profesional. 
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/profil" className="text-muted-foreground hover:text-primary transition-smooth">
                  Profil
                </Link>
              </li>
              <li>
                <Link to="/fasilitas" className="text-muted-foreground hover:text-primary transition-smooth">
                  Fasilitas
                </Link>
              </li>
              <li>
                <Link to="/kegiatan" className="text-muted-foreground hover:text-primary transition-smooth">
                  Kegiatan
                </Link>
              </li>
              <li>
                <Link to="/dokumentasi" className="text-muted-foreground hover:text-primary transition-smooth">
                  Dokumentasi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Daerah Istimewa Yogyakarta, Indonesia</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">+62 811-2999-211</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">info@kwpmunzalan.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} KWP Munzalan Indonesian. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
