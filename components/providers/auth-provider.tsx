"use client";
import { authClient } from "@/lib/auth-client";
import { createContext, useContext, type ReactNode } from "react";

type AuthSession = {
  user: { id: string; email: string; name: string; image?: string | null };
};
const Context = createContext<
  | {
      session: AuthSession | null;
      isLoading: boolean;
      socialProviders: string[];
    }
  | undefined
>(undefined);
export function AuthProvider({
  children,
  socialProviders = [],
}: {
  children: ReactNode;
  socialProviders?: string[];
}) {
  const { data, isPending } = authClient.useSession();
  return (
    <Context.Provider
      value={{ session: data, isLoading: isPending, socialProviders }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAuth() {
  const context = useContext(Context);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
