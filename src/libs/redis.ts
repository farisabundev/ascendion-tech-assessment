import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redis.on("error", (err) => console.error("[Redis] Redis Client Error: ", err));

let isConnecting = false;

async function ensureConnected() {
  if (!redis.isOpen && !isConnecting) {
    isConnecting = true;
    await redis.connect();
  }
}


async function safeSet(...args: Parameters<typeof redis.set>) {
  await ensureConnected();
  return redis.set(...args);
}

async function safeGet(...args: Parameters<typeof redis.get>) {
  await ensureConnected();
  return redis.get(...args);
}

async function safeDel(...args: Parameters<typeof redis.del>) {
  await ensureConnected();
  return redis.del(...args);
}

// Export wrapped redis methods
export default {
  set: safeSet,
  get: safeGet,
  del: safeDel,
};