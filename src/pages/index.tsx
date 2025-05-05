import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/toggle/ThemeToggle";
import { supabase } from "~/lib/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLogin(false);
    toast.success("Kamu telah keluar");
    await router.replace("/");
  };

  const onLogin = async () => {
    await router.push("/login");
  };

  const checkAuth = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setIsLogin(false);
        return;
      }

      if (!sessionData.session) {
        setIsLogin(false);
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        setIsLogin(false);
        return;
      }

      if (userData?.user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    } catch (err) {
      console.error("Error checking auth:", err);
      setIsLogin(false);
    }
  };

  useEffect(() => {
    void checkAuth();
  }, [router]);

  return (
    <>
      <main className="bg-background flex min-h-screen flex-col items-center justify-center gap-y-8">
        <h1 className="text-primary text-3xl">Hello Qepo</h1>
        <ThemeToggle />
        {isLogin ? (
          <div className="flex flex-col gap-y-4">
          <Button variant="outline" onClick={() => router.push("/profile")}>
            Profile
          </Button>

          <Button variant="destructive" onClick={handleLogout}>
            Keluar
          </Button>
          </div>
        ) : (
          <Button onClick={onLogin}>Login</Button>
        )}
      </main>
    </>
  );
}
