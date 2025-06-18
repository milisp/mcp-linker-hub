"use client";

import type React from "react";

import { OAuthButtons, handleOAuthLogin } from "@/components/auth";
import { EmailPasswordForm } from "@/components/auth/email-password-form";
import { useSupabase } from "@/components/providers/supabase-provider";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const router = useRouter();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      // Check if session exists after signup
      if (data.session) {
        // User is directly logged in (email confirmation might be off or already confirmed)
        // Fetch user data after successful signup
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (userData.user && !userData.user.user_metadata.user_name) {
          toast({
            title: "Profile incomplete",
            description: "Please complete your profile information.",
            variant: "default",
          });
          router.push("/complete-profile");
        } else {
          router.push("/login");
        }
      } else {
        // Session is null, meaning email verification is required
        toast({
          title: "Verification email sent",
          description: "Please check your email to verify your account.",
        });
        router.push("/login");
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Failed to sign up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="backdrop-blur-sm bg-background/60 border-muted rounded-md border p-6">
          <div className="space-y-1 mb-4">
            <h2 className="text-2xl font-bold">Create an account</h2>
            <p>Enter your email below to create your account</p>
          </div>
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
            onSubmit={handleEmailSignup}
            type="signup"
          />
          <div className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
