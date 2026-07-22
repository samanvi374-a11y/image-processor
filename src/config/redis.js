const Redis = require("ioredis");

let redis;

if (process.env.REDIS_URL) {
  const isTls = process.env.REDIS_URL.startsWith("rediss://");
  redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    ...(isTls && { tls: { rejectUnauthorized: false } }),
  });
} else {
  redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
  });
}

redis.on("connect", () => {
  console.log("✅ Redis Connected Successfully");
});

redis.on("error", (err) => {
  console.error("❌ Redis Connection Failed:", err.message);
});

module.exports = redis;