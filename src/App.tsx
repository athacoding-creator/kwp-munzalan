import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profil from "./pages/Profil";
import Fasilitas from "./pages/Fasilitas";
import Kegiatan from "./pages/Kegiatan";
import Dokumentasi from "./pages/Dokumentasi";
import Pengumuman from "./pages/Pengumuman";
import Kontak from "./pages/Kontak";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import ProfilAdmin from "./pages/admin/ProfilAdmin";
import FasilitasAdmin from "./pages/admin/FasilitasAdmin";
import KegiatanAdmin from "./pages/admin/KegiatanAdmin";
import DokumentasiAdmin from "./pages/admin/DokumentasiAdmin";
import PengumumanAdmin from "./pages/admin/PengumumanAdmin";
import MediaAdmin from "./pages/admin/MediaAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/fasilitas" element={<Fasilitas />} />
          <Route path="/kegiatan" element={<Kegiatan />} />
          <Route path="/dokumentasi" element={<Dokumentasi />} />
          <Route path="/pengumuman" element={<Pengumuman />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/admin" element={<Auth />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/profil" element={<ProfilAdmin />} />
          <Route path="/admin/fasilitas" element={<FasilitasAdmin />} />
          <Route path="/admin/kegiatan" element={<KegiatanAdmin />} />
          <Route path="/admin/dokumentasi" element={<DokumentasiAdmin />} />
          <Route path="/admin/pengumuman" element={<PengumumanAdmin />} />
          <Route path="/admin/media" element={<MediaAdmin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
