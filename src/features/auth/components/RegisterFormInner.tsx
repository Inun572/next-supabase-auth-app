import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import type { RegisterFormSchema } from "../forms/register";

type RegisterFormInnerProps = {
  onRegisterSubmit: (values: RegisterFormSchema) => void;
  isLoading?: boolean;
  buttonText?: string;
  showPassword?: boolean;
};

export const RegisterFormInner = (props: RegisterFormInnerProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useFormContext<RegisterFormSchema>();

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = (values: RegisterFormSchema) => {
    props.onRegisterSubmit(values);
  };

  return (
    <form
      className="flex flex-col gap-y-2"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type={showPassword ? "text" : "password"} {...field} />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        )}
      />
      {props.showPassword && (
        <Label className="flex items-center space-x-2">
          <Checkbox
            checked={showPassword}
            onCheckedChange={toggleShowPassword}
          />
          Show Password
        </Label>
      )}

      <Button
        disabled={props.isLoading}
        size="lg"
        className="w-full"
        type="submit"
      >
        {props.isLoading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          (props.buttonText ?? "Buat Akun")
        )}
      </Button>
    </form>
  );
};
