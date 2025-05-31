import { NextResponse } from "next/server";
import crypto from "crypto";
import HttpStatusCode from "@/utils/HttpStatus";
import redis from "@/libs/redis";

export async function POST(req: Request) {
  const SECRET = process.env.SECRET;
  const { username } = await req.json();

  if (!SECRET) {
    throw new Error("SECRET environment variable is not set");
  }

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: HttpStatusCode.BAD_REQUEST }
    );
  }

  const now = Date.now();
  const sessionKey = `session:${username}`;
  const sessionRaw = await redis.get(sessionKey);

  if (sessionRaw) {
    const session = JSON.parse(sessionRaw);
    if (now - session.issuedAt < 10_000) {
      return NextResponse.json(
        { error: "You can only request a secure word every 10 seconds" },
        { status: HttpStatusCode.TOO_MANY_REQUESTS }
      );
    }
  }

  const hmac = crypto.createHmac("sha256", SECRET);
  hmac.update(username + now);
  const secureWord = hmac.digest("hex").slice(0, 8);

  const session = {
    secureWord,
    issuedAt: now,
  };

  await redis.set(sessionKey, JSON.stringify(session), {
    EX: 60, // expires in 60 seconds
  });

  return NextResponse.json({ secureWord });
}
