import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";

const ADMIN_EMAIL = "athacoding@gmail.com";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [signupEnabled, setSignupEnabled] = useState(true);
  const [checkingSignup, setCheckingSignup] = useState(true);
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

  useEffect(() => {
    const checkExistingUsers = async () => {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (error) throw error;
        
        // Disable signup if any users exist
        setSignupEnabled(count === 0);
      } catch (error) {
        console.error('Error checking users:', error);
        // On error, disable signup for safety
        setSignupEnabled(false);
      } finally {
        setCheckingSignup(false);
      }
    };

    checkExistingUsers();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate admin email
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      toast({
        title: "Akses Ditolak",
        description: "Hanya email admin yang diizinkan.",
        variant: "destructive",
      });
      return;
    }

    // Check if signup is disabled
    if (isSignUp && !signupEnabled) {
      toast({
        title: "Signup Dinonaktifkan",
        description: "Akun admin sudah ada. Silakan login.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin/dashboard`,
          },
        });
        if (error) throw error;
        toast({
          title: "Akun berhasil dibuat!",
          description: "Silakan cek email untuk verifikasi (jika diaktifkan).",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Login berhasil!", description: "Selamat datang kembali." });
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/admin`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Email Terkirim",
        description: "Silakan cek email Anda untuk link reset password.",
      });
      
      setShowResetPassword(false);
      setResetEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4 islamic-pattern">
        {checkingSignup ? (
          <Card className="w-full max-w-md shadow-elegant border-0">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">Memuat...</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-md shadow-elegant border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {showResetPassword ? "Reset Password" : isSignUp ? "Buat Akun Admin" : "Login Admin"}
            </CardTitle>
            <CardDescription className="text-center">
              {showResetPassword 
                ? "Masukkan email untuk reset password" 
                : isSignUp
                ? "Buat akun admin baru"
                : "Masuk ke dashboard admin"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showResetPassword ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="resetEmail">Email</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full gradient-primary text-primary-foreground"
                  disabled={resetLoading}
                >
                  {resetLoading ? "Mengirim..." : "Kirim Link Reset"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setShowResetPassword(false);
                    setResetEmail("");
                  }}
                >
                  Kembali ke Login
                </Button>
              </form>
            ) : (
              <>
                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@example.com"
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
                    {loading ? "Loading..." : isSignUp ? "Buat Akun" : "Login"}
                  </Button>
                </form>
                <div className="mt-4 space-y-2 text-center">
                  {signupEnabled && (
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-sm text-primary hover:underline block w-full"
                    >
                      {isSignUp ? "Sudah punya akun? Login" : "Belum punya akun? Daftar"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    className="text-sm text-primary hover:underline block w-full"
                  >
                    Lupa Password?
                  </button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
}
