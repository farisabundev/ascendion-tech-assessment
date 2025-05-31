import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redis.on("error", (err) => console.error("[Redis] Redis Client Error: ", err));

if (!redis.isOpen) {
  redis.connect().then(() => {
    console.log("[Redis] Connected");
  });
}

if (!redis.isOpen) await redis.connect();

export default redis;
