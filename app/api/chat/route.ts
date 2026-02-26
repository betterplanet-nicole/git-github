import { NextResponse } from "next/server";
import { generateChatResponse } from "@/lib/chat";
import { persistRecord } from "@/lib/persistence";
import { EventSnapshot } from "@/lib/types";

type Body = {
  message?: string;
  snapshot?: EventSnapshot;
  providerOverride?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;
  if (!body.message || !body.snapshot) {
    return NextResponse.json({ error: "message and snapshot required" }, { status: 400 });
  }

  const previous = process.env.AI_PROVIDER;
  if (body.providerOverride) process.env.AI_PROVIDER = body.providerOverride;
  const response = await generateChatResponse({ message: body.message, snapshot: body.snapshot });
  if (previous) {
    process.env.AI_PROVIDER = previous;
  } else {
    delete process.env.AI_PROVIDER;
  }

  persistRecord({
    kind: "chat",
    body: {
      message: body.message,
      response: response.text,
      citations: response.citations,
      provider: response.provider
    }
  });

  return NextResponse.json(response);
}
