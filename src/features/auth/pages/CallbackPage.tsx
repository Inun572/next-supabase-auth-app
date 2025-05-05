import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "~/lib/supabase/client";
import { api } from "~/utils/api";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

const CallbackPage = () => {
    const [userData, setUserData] = useState<User | null>(null);
  const router = useRouter();

  const getUserProfile = api.profile.getProfile.useQuery();

  const createUserProfile = api.profile.createProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create profile: " + error.message);
    },
  });

  useEffect(() => {
    const handleRedirect = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (session) {
        // sukses login
        const { user } = session;
        setUserData(user);
      } else {
        // gagal login
        await router.replace("/login");
      }
    };

    void handleRedirect();
  }, [router]);

  useEffect(() => {
    if (userData) {
      void getUserProfile.refetch().then(({data, error}) => {
        if (error) {
            toast.error("Gagal mendapatkan data user");
        }
                
        if (data === null) {
            createUserProfile.mutate();
        }

        void router.replace("/");
      });
    }
  }, [userData, router, getUserProfile, createUserProfile]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Redirecting...</h1>
        <p className="mt-4 text-gray-600">Please wait while we log you in.</p>
      </div>
    </div>
  )
}

export default CallbackPage;
