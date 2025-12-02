import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, FileText, Image, Calendar, Megaphone, HardDrive, Activity, ScrollText, BarChart3, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { logAdminActivity } from "@/lib/adminLogger";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin");
      return;
    }
    setUser(session.user);
  };

  const handleLogout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    await logAdminActivity({
      action: "LOGOUT",
      tableName: "auth",
      description: `Admin logout: ${user?.email}`,
    });
    
    await supabase.auth.signOut();
    toast({ title: "Logout berhasil" });
    navigate("/admin");
  };

  const menuItems = [
    { title: "Profil", icon: FileText, link: "/admin/profil", color: "from-blue-500 to-blue-600" },
    { title: "Fasilitas", icon: Image, link: "/admin/fasilitas", color: "from-green-500 to-green-600" },
    { title: "Program", icon: Calendar, link: "/admin/program", color: "from-purple-500 to-purple-600" },
    { title: "Dokumentasi", icon: Image, link: "/admin/dokumentasi", color: "from-orange-500 to-orange-600" },
    { title: "Pengumuman", icon: Megaphone, link: "/admin/pengumuman", color: "from-red-500 to-red-600" },
    { title: "Media Storage", icon: HardDrive, link: "/admin/media", color: "from-cyan-500 to-cyan-600" },
    { title: "Monitoring", icon: Activity, link: "/admin/monitoring", color: "from-indigo-500 to-indigo-600" },
    { title: "Log Aktivitas", icon: ScrollText, link: "/admin/activity-log", color: "from-pink-500 to-pink-600" },
    { title: "Statistik", icon: BarChart3, link: "/admin/statistik", color: "from-violet-500 to-violet-600" },
  ];

  return (
    <div className="min-h-screen bg-muted/30 overflow-x-hidden">
      <nav className="bg-card border-b border-border shadow-soft sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">Dashboard Admin</h1>
            <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
              <Button 
                onClick={() => navigate("/")} 
                variant="outline" 
                size="sm"
                className="h-8 sm:h-9 px-2 sm:px-3"
              >
                <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Website</span>
              </Button>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm"
                className="h-8 sm:h-9 px-2 sm:px-3"
              >
                <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Selamat Datang, Admin</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Kelola konten website KWP Munzalan
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {menuItems.map((item) => (
            <Link key={item.title} to={item.link} className="block">
              <Card className="shadow-soft border hover:shadow-elegant transition-smooth cursor-pointer h-full hover:scale-[1.02] active:scale-[0.98]">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 sm:mb-4`}>
                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Kelola data {item.title.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
