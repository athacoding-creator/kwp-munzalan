import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/admin/dashboard");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Login berhasil!", description: "Selamat datang kembali." });
      } else {
        const redirectUrl = `${window.location.origin}/admin/dashboard`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              username,
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        toast({
          title: "Pendaftaran berhasil!",
          description: "Silakan cek email untuk verifikasi.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4 islamic-pattern">
        <Card className="w-full max-w-md shadow-elegant border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {isLogin ? "Login Admin" : "Daftar Admin"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin
                ? "Masuk ke dashboard admin"
                : "Buat akun admin baru"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="fullName">Nama Lengkap</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground"
                disabled={loading}
              >
                {loading ? "Loading..." : isLogin ? "Login" : "Daftar"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin ? "Belum punya akun? Daftar" : "Sudah punya akun? Login"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
