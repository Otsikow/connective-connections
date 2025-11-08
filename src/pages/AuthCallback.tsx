import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  usePageTitle("Completing Sign-In");

  const code = searchParams.get("code");
  const errorDescription =
    searchParams.get("error_description") ?? searchParams.get("error");
  const nextParam = searchParams.get("next");

  useEffect(() => {
    const nextPath = nextParam && nextParam.startsWith("/") ? nextParam : "/home";

    if (errorDescription) {
      toast({
        title: "Authentication error",
        description: errorDescription,
      });
      navigate("/login", { replace: true });
      return;
    }

    if (!isSupabaseConfigured) {
      toast({
        title: "Authentication unavailable",
        description:
          "Live authentication is disabled in this preview build. Please try again later.",
      });
      navigate("/login", { replace: true });
      return;
    }

    if (!code) {
      toast({
        title: "Authentication error",
        description: "Missing authorization code. Please try again.",
      });
      navigate("/login", { replace: true });
      return;
    }

    const exchangeSession = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        toast({
          title: "Authentication error",
          description: error.message ?? "Unable to complete sign in.",
        });
        navigate("/login", { replace: true });
        return;
      }

      navigate(nextPath, { replace: true });
    };

    void exchangeSession();
  }, [code, errorDescription, navigate, nextParam, toast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#E8B956]" />
        <div>
          <p className="text-base font-semibold text-foreground">Signing you in…</p>
          <p className="text-sm text-muted-foreground mt-1">
            Please wait while we complete your authentication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
