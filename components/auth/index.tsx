"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { AuthType } from "@/types";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

export async function handleOAuthLogin(
  provider: AuthType,
  setIsLoading: (loading: boolean) => void,
) {
  const supabase = createPagesBrowserClient();

  setIsLoading(true);

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      throw error;
    }
  } catch (error: any) {
    toast({
      title: "Login failed",
      description:
        error.message || `Failed to log in with ${provider}. Please try again.`,
      variant: "destructive",
    });
    setIsLoading(false);
  }
}

interface OAuthButtonsProps {
  onLogin: (provider: AuthType) => void;
  isLoading: boolean;
}

export function OAuthButtons({ onLogin, isLoading }: OAuthButtonsProps) {
  return (
    <>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onLogin("github")}
          disabled={isLoading}
        >
          <Github className="mr-2 h-5 w-5" />
          Continue with GitHub
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onLogin("google")}
          disabled={isLoading}
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Continue with Google
        </Button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
    </>
  );
}
