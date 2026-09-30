import { savePublicEvent } from "@/lib/server/http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return savePublicEvent(request, "deeplink-clicks");
}
