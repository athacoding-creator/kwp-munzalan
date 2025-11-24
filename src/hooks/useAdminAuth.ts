import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { isAdmin } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook to check admin authentication and redirect if not authorized
 */
export function useAdminAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/admin");
          return;
        }

        const adminStatus = await isAdmin();
        
        if (!adminStatus) {
          toast({
            title: "Akses Ditolak",
            description: "Anda tidak memiliki izin admin untuk mengakses halaman ini.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Error checking admin auth:", error);
        navigate("/admin");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return { isLoading, isAuthorized };
}
