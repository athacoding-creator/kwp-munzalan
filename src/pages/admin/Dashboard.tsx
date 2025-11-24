import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, FileText, Image, Calendar, Megaphone, HardDrive, Activity, ScrollText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    await supabase.auth.signOut();
    toast({ title: "Logout berhasil" });
    navigate("/admin");
  };

  const menuItems = [
    { title: "Profil", icon: FileText, link: "/admin/profil", color: "from-blue-500 to-blue-600" },
    { title: "Fasilitas", icon: Image, link: "/admin/fasilitas", color: "from-green-500 to-green-600" },
    { title: "Kegiatan", icon: Calendar, link: "/admin/kegiatan", color: "from-purple-500 to-purple-600" },
    { title: "Dokumentasi", icon: Image, link: "/admin/dokumentasi", color: "from-orange-500 to-orange-600" },
    { title: "Pengumuman", icon: Megaphone, link: "/admin/pengumuman", color: "from-red-500 to-red-600" },
    { title: "Media Storage", icon: HardDrive, link: "/admin/media", color: "from-cyan-500 to-cyan-600" },
    { title: "Monitoring", icon: Activity, link: "/admin/monitoring", color: "from-indigo-500 to-indigo-600" },
    { title: "Log Aktivitas", icon: ScrollText, link: "/admin/activity-log", color: "from-pink-500 to-pink-600" },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <nav className="bg-card border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard Admin</h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Selamat Datang, Admin</h2>
          <p className="text-muted-foreground">
            Kelola konten website KWP Munzalan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link key={item.title} to={item.link}>
              <Card className="shadow-soft border-0 hover:shadow-elegant transition-smooth cursor-pointer h-full">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
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
