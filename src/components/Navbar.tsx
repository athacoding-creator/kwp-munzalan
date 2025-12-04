import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoKwp from "@/assets/logo-kwp.png";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Beranda" },
    { to: "/profil", label: "Profil" },
    { to: "/fasilitas", label: "Fasilitas" },
    { to: "/kegiatan", label: "Kegiatan" },
    { to: "/dokumentasi", label: "Dokumentasi" },
    { to: "/pengumuman", label: "Pengumuman" },
    { to: "/kontak", label: "Kontak" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-18 py-2">
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src={logoKwp} 
              alt="Logo KWP Munzalan" 
              className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground leading-tight">Baitul Waqof</span>
              <span className="text-xs text-primary font-medium">Munzalan Indonesia</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg transition-smooth text-sm font-medium ${
                  isActive(link.to)
                    ? "bg-primary text-primary-foreground shadow-elegant"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/admin" className="ml-2">
              <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-border/50 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-smooth ${
                  isActive(link.to)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/admin" onClick={() => setIsOpen(false)}>
              <Button variant="outline" size="sm" className="w-full mt-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                Admin
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
