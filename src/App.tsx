import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Profil = lazy(() => import("./pages/Profil"));
const Fasilitas = lazy(() => import("./pages/Fasilitas"));
const Program = lazy(() => import("./pages/Program"));
const Dokumentasi = lazy(() => import("./pages/Dokumentasi"));
const Artikel = lazy(() => import("./pages/Artikel"));
const Kontak = lazy(() => import("./pages/Kontak"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const ProfilAdmin = lazy(() => import("./pages/admin/ProfilAdmin"));
const FasilitasAdmin = lazy(() => import("./pages/admin/FasilitasAdmin"));
const ProgramAdmin = lazy(() => import("./pages/admin/ProgramAdmin"));
const ProgramUnggulanAdmin = lazy(() => import("./pages/admin/ProgramUnggulanAdmin"));
const DokumentasiAdmin = lazy(() => import("./pages/admin/DokumentasiAdmin"));
const PengumumanAdmin = lazy(() => import("./pages/admin/PengumumanAdmin"));
const MediaAdmin = lazy(() => import("./pages/admin/MediaAdmin"));
const MonitoringAdmin = lazy(() => import("./pages/admin/MonitoringAdmin"));
const ActivityLogAdmin = lazy(() => import("./pages/admin/ActivityLogAdmin"));
const StatistikAdmin = lazy(() => import("./pages/admin/StatistikAdmin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <ErrorBoundary>
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
              <Route path="/program" element={<Program />} />
              <Route path="/dokumentasi" element={<Dokumentasi />} />
              <Route path="/artikel" element={<Artikel />} />
              <Route path="/kontak" element={<Kontak />} />
              <Route path="/admin" element={<Auth />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/profil" element={<ProfilAdmin />} />
              <Route path="/admin/fasilitas" element={<FasilitasAdmin />} />
              <Route path="/admin/program" element={<ProgramAdmin />} />
              <Route path="/admin/program-unggulan" element={<ProgramUnggulanAdmin />} />
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
  </ErrorBoundary>
);

export default App;
