import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const runtime = "nodejs";

type SubscribeRequest = {
  email?: unknown;
  source?: unknown;
  vision?: unknown;
  deity?: unknown;
  spirit?: unknown;
};

function getServerPrefix(apiKey: string) {
  return process.env.MAILCHIMP_SERVER_PREFIX || apiKey.split("-")[1];
}

function buildTags(body: SubscribeRequest) {
  const tags = new Set(["Seer Circle"]);

  if (body.source === "daily-vision") {
    tags.add("Daily Vision");
  }

  return Array.from(tags);
}

export async function POST(request: Request) {
  let body: SubscribeRequest;

  try {
    body = (await request.json()) as SubscribeRequest;
  } catch {
    return NextResponse.json({ message: "The glass could not read that request." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { message: "The glass could not read that. Check the address and look again." },
      { status: 400 },
    );
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix = apiKey ? getServerPrefix(apiKey) : undefined;

  if (!apiKey || !audienceId || !serverPrefix) {
    return NextResponse.json(
      { message: "The Circle is not connected yet. Add the Mailchimp keys in Vercel." },
      { status: 503 },
    );
  }

  const subscriberHash = createHash("md5").update(email).digest("hex");
  const endpoint = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`;

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Basic ${Buffer.from(`gazeglass:${apiKey}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email_address: email,
      status_if_new: "subscribed",
      tags: buildTags(body),
    }),
  });

  if (response.ok) {
    return NextResponse.json({ message: "The Seer has your name. Watch for the first letter." });
  }

  let detail = "";

  try {
    const error = (await response.json()) as { detail?: string; title?: string };
    detail = error.detail || error.title || "";
  } catch {
    detail = "";
  }

  return NextResponse.json(
    {
      message:
        detail ||
        "The glass clouded before the name could be recorded. Please try again in a moment.",
    },
    { status: response.status || 500 },
  );
}
