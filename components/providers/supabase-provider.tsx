"use client";

import type React from "react";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type SupabaseContext = {
  supabase: SupabaseClient;
  session: Session | null;
  getAccessToken: () => Promise<string | null>;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClientComponentClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 辅助函数: 检查session是否快过期并刷新
    const refreshIfNeeded = async (
      currentSession: Session | null,
    ): Promise<Session | null> => {
      if (!currentSession || !currentSession.expires_at) return null;
      const expiresIn =
        new Date(currentSession.expires_at * 1000).getTime() - Date.now();
      if (expiresIn < 300000) {
        const {
          data: { session: newSession },
          error,
        } = await supabase.auth.refreshSession();
        if (!error && newSession) return newSession;
      }
      return currentSession;
    };

    // 初始化时获取 session
    const initializeSession = async () => {
      try {
        const {
          data: { session: initialSession },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        const updatedSession = await refreshIfNeeded(initialSession);
        setSession(updatedSession);
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();

    // 监听认证状态变化
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (event === "TOKEN_REFRESHED") {
        setSession(currentSession);
      } else if (currentSession) {
        setSession(currentSession);
      } else {
        setSession(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // getAccessToken 使用 refreshIfNeeded
  const getAccessToken = async () => {
    if (!session) return null;
    // 辅助函数refreshIfNeeded定义在useEffect中, 需重新定义
    const refreshIfNeeded = async (
      currentSession: Session | null,
    ): Promise<Session | null> => {
      if (!currentSession || !currentSession.expires_at) return null;
      const expiresIn =
        new Date(currentSession.expires_at * 1000).getTime() - Date.now();
      if (expiresIn < 300000) {
        const {
          data: { session: newSession },
          error,
        } = await supabase.auth.refreshSession();
        if (!error && newSession) return newSession;
      }
      return currentSession;
    };
    const updatedSession = await refreshIfNeeded(session);
    if (
      updatedSession &&
      updatedSession.access_token !== session.access_token
    ) {
      setSession(updatedSession);
    }
    return updatedSession?.access_token ?? null;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Context.Provider value={{ supabase, session, getAccessToken }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }
  return context;
};
