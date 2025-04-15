import { useEffect, type PropsWithChildren } from "react";
import { useRouter } from "next/router";
import { supabase } from "~/lib/supabase/client";

const AuthRoute = (props: PropsWithChildren) => {
  const router = useRouter();

  useEffect(() => {
    void (async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        await router.replace("/");
      }
    })();
  }, [router]);

  return props.children;
};

export default AuthRoute;
