import { POST, createMfaSession } from "@/app/api/verifyMfa/route";
import redis from "@/libs/redis";
import HttpStatusCode from "@/utils/HttpStatus";

// mock Date.now for consistent timing
const now = Date.now();
jest.spyOn(Date, "now").mockImplementation(() => now);

jest.mock("@/libs/redis");

describe("POST /api/verifyMfa", () => {
  const username = "johndoe";
  const secret = "johndoe-some-secret";
  const code = "ABC123";

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should return 400 if username or code is missing", async () => {
    const req = { json: async () => ({}) } as Request;
    const res = await POST(req);
    expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
    const body = await res.json();
    expect(body.error).toBe("Username and code are required");
  });

  it("should return 400 if no MFA session found", async () => {
    (redis.get as jest.Mock).mockResolvedValue(null);

    const req = {
      json: async () => ({ username, code }),
    } as Request;

    const res = await POST(req);
    expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
    const body = await res.json();
    expect(body.error).toBe("No MFA session found for user");
  });

  it("should verify successfully with correct code", async () => {
    const session = { code, attempts: 0 };
    (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(session));
    (redis.del as jest.Mock).mockResolvedValue(1);

    const req = {
      json: async () => ({ username, code }),
    } as Request;

    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toBe("MFA verified successfully");
  });

  it("should return unauthorized on wrong code", async () => {
    const session = { code: "WRONG123", attempts: 0 };
    (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(session));
    (redis.set as jest.Mock).mockResolvedValue("OK");

    const req = {
      json: async () => ({ username, code: "BADCODE" }),
    } as Request;

    const res = await POST(req);
    expect(res.status).toBe(HttpStatusCode.UNAUTHORIZED);
    const body = await res.json();
    expect(body.error).toMatch(/Invalid code/);
  });

  it("should lock the user after 3 failed attempts", async () => {
    const session = { code: "WRONG123", attempts: 2 };
    (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(session));
    (redis.set as jest.Mock).mockResolvedValue("OK");

    const req = {
      json: async () => ({ username, code: "BADCODE" }),
    } as Request;

    const res = await POST(req);
    expect(res.status).toBe(HttpStatusCode.TOO_MANY_REQUESTS);
    const body = await res.json();
    expect(body.error).toMatch(/Too many failed attempts/);
  });

  it("should block access if lockedUntil is in the future", async () => {
    const session = {
      code: "SOMECODE",
      attempts: 3,
      lockedUntil: now + 10000, // 10 seconds in future
    };
    (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(session));

    const req = {
      json: async () => ({ username, code: "ANY" }),
    } as Request;

    const res = await POST(req);
    expect(res.status).toBe(HttpStatusCode.TOO_MANY_REQUESTS);
    const body = await res.json();
    expect(body.error).toMatch(/Account locked/);
  });
});
