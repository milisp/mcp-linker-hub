"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import type { AuthType } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";
import { authClient } from "@/lib/auth-client";
import { FaGithub as Github } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export async function handleOAuthLogin(
  provider: AuthType,
  setIsLoading: (loading: boolean) => void,
) {
  setIsLoading(true);

  try {
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/",
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
  const { socialProviders } = useAuth();
  if (!socialProviders.length) return null;
  return (
    <>
      <div className="space-y-2">
        {socialProviders.includes("github") ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onLogin("github")}
            disabled={isLoading}
          >
            <Github className="mr-2 h-5 w-5" />
            Continue with GitHub
          </Button>
        ) : null}
        {socialProviders.includes("google") ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onLogin("google")}
            disabled={isLoading}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>
        ) : null}
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
