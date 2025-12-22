import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import logoKwp from "@/assets/logo-kwp.png";
export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const location = useLocation();
  const mainLinks = [{
    to: "/",
    label: "Beranda"
  }, {
    to: "/artikel",
    label: "Artikel"
  }, {
    to: "/kontak",
    label: "Kontak"
  }];
  const externalLinks = [{
    href: "https://munzalan.id",
    label: "Munzalan.id"
  }];
  const aboutLinks = [{
    to: "/profil",
    label: "Profil"
  }, {
    to: "/fasilitas",
    label: "Fasilitas"
  }, {
    to: "/program",
    label: "Program"
  }, {
    to: "/dokumentasi",
    label: "Dokumentasi"
  }];
  const isActive = (path: string) => location.pathname === path;
  const isAboutActive = aboutLinks.some(link => location.pathname === link.to);
  return <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-soft">
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="flex justify-between items-center py-3">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logoKwp} alt="Logo KWP Munzalan" className="h-10 md:h-12 w-auto object-contain group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-bold text-primary leading-tight">MASJID KAPAL</span>
              <span className="text-sm md:text-base font-bold text-primary leading-tight">MUNZALAN</span>
              <span className="text-[10px] md:text-xs font-semibold text-white bg-primary px-2 py-0.5 rounded mt-0.5">YOGYAKARTA</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Beranda */}
            <Link to="/" className={`px-4 py-2 rounded-lg transition-smooth text-sm font-medium ${isActive("/") ? "gradient-primary text-white shadow-elegant" : "text-muted-foreground hover:text-foreground hover:bg-primary/10"}`}>
              Beranda
            </Link>

            {/* About Us Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`px-4 py-2 rounded-lg transition-smooth text-sm font-medium flex items-center gap-1 ${isAboutActive ? "gradient-primary text-white shadow-elegant" : "text-muted-foreground hover:text-foreground hover:bg-primary/10"}`}>
                  About Us
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {aboutLinks.map(link => <DropdownMenuItem key={link.to} asChild>
                    <Link to={link.to} className={`w-full cursor-pointer ${isActive(link.to) ? "gradient-primary text-white font-medium" : ""}`}>
                      {link.label}
                    </Link>
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Artikel & Kontak */}
            <Link to="/artikel" className={`px-4 py-2 rounded-lg transition-smooth text-sm font-medium ${isActive("/artikel") ? "gradient-primary text-white shadow-elegant" : "text-muted-foreground hover:text-foreground hover:bg-primary/10"}`}>
              Artikel
            </Link>
            <Link to="/kontak" className={`px-4 py-2 rounded-lg transition-smooth text-sm font-medium ${isActive("/kontak") ? "gradient-primary text-white shadow-elegant" : "text-muted-foreground hover:text-foreground hover:bg-primary/10"}`}>
              Kontak
            </Link>

            {/* External Link to Munzalan.id */}
            <a href="https://munzalan.id" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg transition-smooth text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/10">
              Munzalan.id
            </a>

            <Link to="/admin" className="ml-2">
              
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <div className="lg:hidden py-4 space-y-2 border-t border-border/50 animate-fade-in">
            <Link to="/" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-lg transition-smooth ${isActive("/") ? "gradient-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
              Beranda
            </Link>

            {/* Mobile About Us Accordion */}
            <div>
              <button onClick={() => setAboutOpen(!aboutOpen)} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-smooth ${isAboutActive ? "gradient-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                About Us
                <ChevronDown className={`h-4 w-4 transition-transform ${aboutOpen ? "rotate-180" : ""}`} />
              </button>
              {aboutOpen && <div className="ml-4 mt-2 space-y-1 border-l-2 border-primary/30 pl-4">
                  {aboutLinks.map(link => <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)} className={`block px-4 py-2 rounded-lg transition-smooth text-sm ${isActive(link.to) ? "bg-primary/20 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                      {link.label}
                    </Link>)}
                </div>}
            </div>

            <Link to="/artikel" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-lg transition-smooth ${isActive("/artikel") ? "gradient-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
              Artikel
            </Link>
            <Link to="/kontak" onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-lg transition-smooth ${isActive("/kontak") ? "gradient-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
              Kontak
            </Link>

            {/* Mobile External Link */}
            <a href="https://munzalan.id" target="_blank" rel="noopener noreferrer" className="block px-4 py-3 rounded-lg transition-smooth text-muted-foreground hover:text-foreground hover:bg-muted" onClick={() => setIsOpen(false)}>
              Munzalan.id
            </a>
          </div>}
      </div>
    </nav>;
};