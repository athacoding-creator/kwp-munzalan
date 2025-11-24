import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Profil = lazy(() => import("./pages/Profil"));
const Fasilitas = lazy(() => import("./pages/Fasilitas"));
const Kegiatan = lazy(() => import("./pages/Kegiatan"));
const Dokumentasi = lazy(() => import("./pages/Dokumentasi"));
const Pengumuman = lazy(() => import("./pages/Pengumuman"));
const Kontak = lazy(() => import("./pages/Kontak"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ProfilAdmin = lazy(() => import("./pages/admin/ProfilAdmin"));
const FasilitasAdmin = lazy(() => import("./pages/admin/FasilitasAdmin"));
const KegiatanAdmin = lazy(() => import("./pages/admin/KegiatanAdmin"));
const DokumentasiAdmin = lazy(() => import("./pages/admin/DokumentasiAdmin"));
const PengumumanAdmin = lazy(() => import("./pages/admin/PengumumanAdmin"));
const MediaAdmin = lazy(() => import("./pages/admin/MediaAdmin"));
const MonitoringAdmin = lazy(() => import("./pages/admin/MonitoringAdmin"));
const ActivityLogAdmin = lazy(() => import("./pages/admin/ActivityLogAdmin"));
const StatistikAdmin = lazy(() => import("./pages/admin/StatistikAdmin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }>
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
            <Route path="/admin/monitoring" element={<MonitoringAdmin />} />
            <Route path="/admin/activity-log" element={<ActivityLogAdmin />} />
            <Route path="/admin/statistik" element={<StatistikAdmin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
