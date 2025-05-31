import { NextResponse } from "next/server";
import HttpStatusCode from "@/utils/HttpStatus";
import redis from "@/libs/redis";
import { createMfaSession } from "../verifyMfa/route";

export async function POST(request: Request) {
  const { username, hashedPassword, secureWord } = await request.json();

  if (!username || !hashedPassword || !secureWord) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: HttpStatusCode.BAD_REQUEST }
    );
  }

  const sessionRaw = await redis.get(`session:${username}`);
  if (!sessionRaw) {
    return NextResponse.json(
      { error: "No secure word found for this user" },
      { status: HttpStatusCode.UNAUTHORIZED }
    );
  }

  const session = JSON.parse(sessionRaw);
  const now = Date.now();

  if (session.secureWord !== secureWord) {
    return NextResponse.json(
      { error: "Invalid secure word" },
      { status: HttpStatusCode.UNAUTHORIZED }
    );
  }
  if (now - session.issuedAt > 60_000) {
    return NextResponse.json(
      { error: "Secure word expired" },
      { status: HttpStatusCode.UNAUTHORIZED }
    );
  }

  const mockToken = `mock-token-${username}-${Date.now()}`;
  const secret = username + "-some-secret";
  const mfaCode = await createMfaSession(username, secret);

  console.log(`[MFA] Code for ${username}: ${mfaCode}`);

  return NextResponse.json({ token: mockToken });
}
