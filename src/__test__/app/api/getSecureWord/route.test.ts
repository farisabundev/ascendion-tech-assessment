import { POST } from "@/app/api/getSecureWord/route";
import redis from "@/libs/redis";

jest.mock("@/libs/redis", () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

jest.mock("crypto", () => {
  const actualCrypto = jest.requireActual("crypto");
  return {
    ...actualCrypto,
    createHmac: jest.fn(() => ({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn(() => "mockedsecureword1234567890"),
    })),
  };
});

describe("POST /api/getSecureWord", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date("2025-05-31T12:00:00Z"));
    process.env = { ...OLD_ENV, SECRET: "test-secret" };
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.useRealTimers();
  });

  it("should return 400 if username is missing", async () => {
    const req = {
      json: async () => ({}),
    } as Request;

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Username is required");
  });

  it("should return 429 if secure word was recently requested", async () => {
    (redis.get as jest.Mock).mockResolvedValue(
      JSON.stringify({ issuedAt: Date.now() - 5000 })
    );

    const req = {
      json: async () => ({ username: "johndoe" }),
    } as Request;

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(429);
    expect(json.error).toMatch(/every 10 seconds/);
  });

  it("should return 200 and a secure word if valid request", async () => {
    (redis.get as jest.Mock).mockResolvedValue(null);

    const req = {
      json: async () => ({ username: "johndoe" }),
    } as Request;

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.secureWord).toBe("mockedse");
    expect(redis.set).toHaveBeenCalled();
  });

  it("should throw error if SECRET is undefined", async () => {
    delete process.env.SECRET;

    const req = {
      json: async () => ({ username: "johndoe" }),
    } as Request;

    await expect(POST(req)).rejects.toThrow(
      "SECRET environment variable is not set"
    );
  });
});
