import { getCurrentUser } from "@/lib/server/auth";
import {
  hostedServices,
  issueKey,
  listKeys,
  revokeKey,
  safeOrigin,
} from "@/lib/server/hosting";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getCurrentUser(request);
  if (!user)
    return Response.json({ error: "Sign in required" }, { status: 401 });
  return Response.json(
    {
      keys: listKeys(user.id),
      services: hostedServices().map(({ id, name }) => ({ id, name })),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (!safeOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const user = await getCurrentUser(request);
  if (!user)
    return Response.json({ error: "Sign in required" }, { status: 401 });
  try {
    return Response.json(issueKey(user.id), {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      {
        error: "Unable to create key; revoke an existing key if you have five",
      },
      { status: 409 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!safeOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  const user = await getCurrentUser(request);
  if (!user)
    return Response.json({ error: "Sign in required" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id || !revokeKey(user.id, id))
    return Response.json({ error: "Key not found" }, { status: 404 });
  return new Response(null, { status: 204 });
}
