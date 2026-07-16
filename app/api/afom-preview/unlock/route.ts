import { NextResponse } from "next/server";
import {
  AFOM_ACCESS_COOKIE,
  afomAccessToken,
  isCorrectAfomPassword,
} from "../../../novels/a-family-of-mortals/access";

export async function POST(request: Request) {
  let password = "";

  try {
    const body = (await request.json()) as { password?: unknown };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!isCorrectAfomPassword(password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AFOM_ACCESS_COOKIE, afomAccessToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/novels/a-family-of-mortals",
  });

  return response;
}
