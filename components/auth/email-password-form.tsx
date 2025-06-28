"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import type React from "react";

interface EmailPasswordFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  type: "login" | "signup";
}

export function EmailPasswordForm({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  onSubmit,
  type,
}: EmailPasswordFormProps) {
  const isLogin = type === "login";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {isLogin && (
            <Link
              href="/account/forgot-password"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Forgot password?
            </Link>
          )}
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? isLogin
            ? "Logging in..."
            : "Creating account..."
          : isLogin
            ? "Login"
            : "Create account"}
      </Button>
    </form>
  );
}
