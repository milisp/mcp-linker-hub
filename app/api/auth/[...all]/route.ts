import { auth, initializeAuth } from "@/lib/server/auth";
export const runtime = "nodejs";
async function handler(request: Request) {
  await initializeAuth();
  return auth.handler(request);
}
export { handler as GET, handler as POST };
