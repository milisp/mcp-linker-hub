"use client";

import type React from "react";

import { OAuthButtons, handleOAuthLogin } from "@/components/auth";
import { EmailPasswordForm } from "@/components/auth/email-password-form";
import { useSupabase } from "@/components/providers/supabase-provider";
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
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      });

      router.push("/");
      router.refresh();
    } catch (error: any) {
      let errorMessage = "Failed to log in. Please try again.";
      let errorTitle = "Login failed";

      // Handle specific error cases
      if (error.message?.includes("Email not confirmed")) {
        errorTitle = "Email verification required";
        errorMessage =
          "Please check your email and click the verification link before logging in.";
      } else if (error.message?.includes("Invalid login credentials")) {
        errorMessage =
          "Invalid email or password. Please check your credentials and try again.";
      } else if (error.message?.includes("Too many requests")) {
        errorMessage =
          "Too many login attempts. Please wait a moment before trying again.";
      } else if (error.status === 400) {
        // Generic 400 error - could be unverified email or other issues
        errorTitle = "Account verification required";
        errorMessage =
          "Your account may need verification. Please check your email for verification instructions, or contact support if you continue having issues.";
      }

      toast({
        title: errorTitle,
        description: errorMessage,
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
                href="/signup"
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
