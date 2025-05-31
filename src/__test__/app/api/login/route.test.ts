import { POST } from "@/app/api/login/route";
import redis from "@/libs/redis";
import { createMfaSession } from "@/app/api/verifyMfa/route";

jest.mock("@/libs/redis", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock("@/app/api/verifyMfa/route", () => ({
  __esModule: true,
  createMfaSession: jest.fn(),
}));

describe("POST /api/login", () => {
  const baseReq = {
    username: "johndoe",
    hashedPassword: "hashed",
    secureWord: "abc12345",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if required fields are missing", async () => {
    const req = {
      json: async () => ({}),
    } as Request;

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("should return 401 if no session in Redis", async () => {
    (redis.get as jest.Mock).mockResolvedValue(null);

    const req = {
      json: async () => baseReq,
    } as Request;

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("should return 401 if secure word is incorrect", async () => {
    (redis.get as jest.Mock).mockResolvedValue(
      JSON.stringify({
        secureWord: "wrongword",
        issuedAt: Date.now(),
      })
    );

    const req = {
      json: async () => baseReq,
    } as Request;

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("should return 401 if secure word expired", async () => {
    (redis.get as jest.Mock).mockResolvedValue(
      JSON.stringify({
        secureWord: baseReq.secureWord,
        issuedAt: Date.now() - 70_000,
      })
    );

    const req = {
      json: async () => baseReq,
    } as Request;

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("should return 200 and token if login successful", async () => {
    (redis.get as jest.Mock).mockResolvedValue(
      JSON.stringify({
        secureWord: baseReq.secureWord,
        issuedAt: Date.now(),
      })
    );

    (createMfaSession as jest.Mock).mockResolvedValue("654321");
    jest.spyOn(console, "log").mockImplementation(() => {});

    const req = {
      json: async () => baseReq,
    } as Request;

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.token).toMatch(/^mock-token-/);
    expect(createMfaSession).toHaveBeenCalledWith("johndoe", expect.stringContaining("johndoe"));
  });
});
