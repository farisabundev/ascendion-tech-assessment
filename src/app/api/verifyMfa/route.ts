import { NextResponse } from "next/server";
import crypto from "crypto";
import HttpStatusCode from "@/utils/HttpStatus";
import redis from "@/libs/redis";

const generateMfaCode = (secret: string) => {
  const hash = crypto.createHash("sha256").update(secret).digest("hex");
  return hash.slice(0, 6).toUpperCase();
};

export async function POST(request: Request) {
  const { username, code } = await request.json();

  if (!username || !code) {
    return NextResponse.json(
      { error: "Username and code are required" },
      { status: HttpStatusCode.BAD_REQUEST }
    );
  }

  const raw = await redis.get(`mfa:${username}`);

  if (!raw) {
    return NextResponse.json(
      { error: "No MFA session found for user" },
      { status: HttpStatusCode.BAD_REQUEST }
    );
  }

  const now = Date.now();
  const session = JSON.parse(raw) as {
    code: string;
    attempts: number;
    lockedUntil?: number;
  };

  if (session.lockedUntil && now < session.lockedUntil) {
    return NextResponse.json(
      { error: "Account locked due to too many attempts. Try again later." },
      { status: HttpStatusCode.TOO_MANY_REQUESTS }
    );
  }

  if (session.code === code) {
    await redis.del(`mfa:${username}`);
    return NextResponse.json({ message: "MFA verified successfully" });
  } else {
    session.attempts += 1;

    if (session.attempts >= 3) {
      session.lockedUntil = now + 1 * 60 * 1000;
    }

    await redis.set(`mfa:${username}`, JSON.stringify(session), {
      EX: 120, // expire in 2 mins
    });

    return NextResponse.json(
      {
        error:
          session.attempts >= 3
            ? "Too many failed attempts. Account locked for 1 minute."
            : `Invalid code. ${3 - session.attempts} attempts left.`,
      },
      {
        status:
          session.attempts >= 3
            ? HttpStatusCode.TOO_MANY_REQUESTS
            : HttpStatusCode.UNAUTHORIZED,
      }
    );
  }
}

export async function createMfaSession(username: string, secret: string) {
  const code = generateMfaCode(secret);
  const session = { code, attempts: 0 };
  await redis.set(`mfa:${username}`, JSON.stringify(session), { EX: 120 }); // expires in 2 min
  return code;
}
