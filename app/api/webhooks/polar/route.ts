import { webhooks } from "@polar-sh/sdk/2026-04";
import { initializeAuth } from "@/lib/server/auth";
import {
  applyVerifiedBillingEvent,
  type BillingEvent,
} from "@/lib/server/billing";
import { errorResponse, HttpError } from "@/lib/server/http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret)
    return Response.json(
      { detail: "Webhook is not configured" },
      { status: 503 },
    );
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new HttpError(400, "Missing webhook body");
    const chunks: Uint8Array[] = [];
    let length = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 1048576) {
        await reader.cancel();
        throw new HttpError(413, "Webhook body is too large");
      }
      chunks.push(value);
    }
    const event = await webhooks.validateEvent(
      Buffer.concat(chunks),
      Object.fromEntries(request.headers.entries()),
      secret,
    );
    const eventId = request.headers.get("webhook-id");
    if (!eventId || eventId.length > 200)
      throw new HttpError(400, "Missing webhook ID");
    await initializeAuth();
    applyVerifiedBillingEvent(eventId, event as BillingEvent);
    return Response.json({ received: true });
  } catch (error) {
    if (error instanceof webhooks.PolarWebhookVerificationError)
      return Response.json(
        { detail: "Invalid webhook signature" },
        { status: 403 },
      );
    return errorResponse(error);
  }
}
