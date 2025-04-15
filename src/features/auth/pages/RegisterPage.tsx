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
import { api } from "~/utils/api";
import { toast } from "sonner";
import GuestPage from "~/components/layout/GuestPage";

const RegisterPage = () => {
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
  });

  const { mutate: registerUser, isPending: registerUserIsPending } =
    api.auth.register.useMutation({
      onSuccess: () => {
        toast.success("Register success");
        form.reset({
          email: "",
          password: "",
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleRegisterSubmit = (values: RegisterFormSchema) => {
    registerUser(values);
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
                <h1 className="text-primary text-3xl font-bold">Buat Akun</h1>
                <p className="text-muted-foreground text-sm">
                  Qepo-in kreator favorite kamu
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <RegisterFormInner
                    onRegisterSubmit={handleRegisterSubmit}
                    isLoading={registerUserIsPending}
                    showPassword={true}
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
                  >
                    <FcGoogle />
                    <span>Buat akun dengan Google</span>
                  </Button>
                </div>

                <p className="text-muted-foreground text-sm">
                  Sudah punya akun?{" "}
                  <Link href="/login" className="text-primary underline">
                    Login
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
export default RegisterPage;
