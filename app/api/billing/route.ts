import { getCurrentUser } from "@/lib/server/auth";
import { getBillingStatus } from "@/lib/server/billing";
import { errorResponse, HttpError } from "@/lib/server/http";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) throw new HttpError(401, "Sign in to view billing");
    return Response.json(getBillingStatus(user.id), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
