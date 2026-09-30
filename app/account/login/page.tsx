"use client";

import type React from "react";

import { OAuthButtons, handleOAuthLogin } from "@/components/auth";
import { EmailPasswordForm } from "@/components/auth/email-password-form";
import { authClient } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) throw error;
      const redirect = new URLSearchParams(window.location.search).get(
        "redirect",
      );
      router.push(
        redirect === "/hosting" || redirect === "/pricing" ? redirect : "/",
      );
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Unable to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card className="backdrop-blur-sm bg-background/60 border-muted">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your email and password to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <OAuthButtons
              onLogin={(provider) => handleOAuthLogin(provider, setIsLoading)}
              isLoading={isLoading}
            />
            <EmailPasswordForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              isLoading={isLoading}
              onSubmit={handleEmailLogin}
              type="login"
            />
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/account/signup"
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
