import { getCurrentUser } from "@/lib/server/auth";
import { getBillingProducts, getPolar } from "@/lib/server/billing";
import { checkOrigin, errorResponse, HttpError } from "@/lib/server/http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    if (
      request.headers.get("origin") !==
      new URL(process.env.BETTER_AUTH_URL || request.url).origin
    )
      throw new HttpError(403, "A same-origin checkout request is required");
    const user = await getCurrentUser(request);
    if (!user) throw new HttpError(401, "Sign in before checkout");
    const plan = new URL(request.url).searchParams.get("plan");
    const product = getBillingProducts().find((p) => p.slug === plan);
    if (!product) throw new HttpError(400, "Unknown plan");
    const base = process.env.BETTER_AUTH_URL;
    if (!base) throw new HttpError(503, "Checkout URL is not configured");
    const checkout = await getPolar().checkouts.create({
      products: [product.productId],
      external_customer_id: user.id,
      customer_email: user.email,
      success_url: new URL("/success", base).href,
      return_url: new URL("/pricing", base).href,
    });
    return Response.json(
      { url: checkout.url },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
