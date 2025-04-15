import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/toggle/ThemeToggle";
import { supabase } from "~/lib/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// import { api } from "~/utils/api";

export default function Home() {
  const [isLogin, setIsLogin] = useState(false);

  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLogin(false);
    toast.success("Kamu telah keluar");
  };

  const onLogin = async () => {
    await router.push("/login");
  };
  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    })();
  }, []);

  return (
    <>
      <main className="bg-background flex min-h-screen flex-col items-center justify-center gap-y-8">
        <h1 className="text-primary text-3xl">Hello Qepo</h1>
        <ThemeToggle />
        {isLogin ? (
          <Button variant="destructive" onClick={handleLogout}>
            Keluar
          </Button>
        ) : (
          <Button onClick={onLogin}>Login</Button>
        )}
      </main>
    </>
  );
}
