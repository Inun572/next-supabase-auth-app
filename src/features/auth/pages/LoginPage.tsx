import { useForm } from "react-hook-form";
import { PageContainer } from "~/components/layout/PageContainer";
import { SectionContainer } from "~/components/layout/SectionContainer";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import { type RegisterFormSchema, registerFormSchema } from "../forms/register";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { RegisterFormInner } from "../components/RegisterFormInner";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { supabase } from "~/lib/supabase/client";
import type { AuthError } from "@supabase/supabase-js";
import { SupabaseAuthErrorCode } from "~/lib/supabase/authErrorCodes";
import GuestPage from "~/components/layout/GuestPage";

const LoginPage = () => {
  const form = useForm<RegisterFormSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(registerFormSchema),
  });

  const router = useRouter();

  const handleLoginSubmit = async (values: RegisterFormSchema) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        toast.success("Login success");
        await router.replace("/");
      }
    } catch (error) {
      switch ((error as AuthError).code) {
        case SupabaseAuthErrorCode.invalid_credentials:
          form.setError("email", {
            message: "Email atau password salah",
          });
          form.setError("password", {
            message: "Email atau password salah",
          });
          break;
        case SupabaseAuthErrorCode.user_not_found:
          form.setError("email", {
            message: "Email tidak terdaftar",
          });
          break;
        case SupabaseAuthErrorCode.email_not_confirmed:
          form.setError("email", {
            message: "Email belum diverifikasi",
          });
          break;
        default:
          toast.error("Kesalahan tidak terduga");
      }
    }
  };

  const handleLoginGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/callback`,
      }
    });
  };

  return (
    <main>
      <GuestPage>
        <PageContainer>
          <SectionContainer
            className="flex min-h-[calc(100vh-144px)] w-full flex-col justify-center"
            padded
          >
            <Card className="w-full max-w-[480px]">
              <CardHeader className="flex flex-col items-center justify-center">
                {/* logo here */}
                <h1 className="text-primary text-3xl font-bold">
                  Selamat Datang Kembali
                </h1>
                <p className="text-muted-foreground text-sm">
                  Qepo-in kreator favorite kamu
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <RegisterFormInner
                    onRegisterSubmit={handleLoginSubmit}
                    buttonText="Masuk"
                    showPassword
                  />
                </Form>

                {/* Contiune with google */}
              </CardContent>
              <CardFooter className="flex flex-col items-center justify-center space-y-2">
                <div className="flex w-full items-center justify-center">
                  <div className="bg-muted-foreground h-[1px] w-1/2 border-t-2" />
                  <span className="text-muted-foreground mx-2 text-sm text-nowrap">
                    Atau lanjut dengan
                  </span>
                  <div className="bg-muted-foreground h-[1px] w-1/2 border-t-2" />
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full cursor-pointer"
                    onClick={handleLoginGoogle}
                  >
                    <FcGoogle />
                    <span>Masuk dengan Google</span>
                  </Button>
                </div>

                <p className="text-muted-foreground text-sm">
                  Sudah punya akun?{" "}
                  <Link href="/register" className="text-primary underline">
                    Daftar
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </SectionContainer>
        </PageContainer>
      </GuestPage>
    </main>
  );
};
export default LoginPage;
