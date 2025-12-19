import React from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import loginSchema from "@/schemas/auth/login-schema";
import type { LoginPayload } from "@/types/auth";
import { useIsToken } from "@/hooks/use-token";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = React.useState<LoginPayload>({ username: "", password: "" });
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleLogin = useIsToken();

  const validate = (): boolean => {
    const { error } = loginSchema.validate(formData, { abortEarly: false });
    if (error) {
      const validationErrors: { [key: string]: string } = {};
      error.details.forEach((detail) => {
        const field = detail.path[0] as string;
        validationErrors[field] = detail.message;
      })
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    try {
      setLoading(true);
      await handleLogin(formData);
    } catch (err) {
      setServerError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} noValidate className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your <span className="text-primary font-extralight">REC Monitoring</span> account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="username">Email</FieldLabel>
                <Input
                  id="username"
                  type="email"
                  name="username"
                  value={formData.username}
                  placeholder="yourname@rectech-global.com"
                  onChange={handleChange}
                  autoComplete="username"
                  disabled={loading}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  name="password"
                  value={formData.password}
                  placeholder="password"
                  onChange={handleChange}
                  disabled={loading}
                  required 
                />
              </Field>
              <Field>
                {serverError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                    {serverError}
                  </div>
                )}
                <Button type="submit">Login</Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field className="w-full">
                <Button variant="outline" type="button">
                  Login with SSO
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="#">Contact IT Department</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/rec.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
