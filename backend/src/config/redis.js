import { createClient } from "redis";
import config from "./env.js";

export const redisClient = createClient({
  url: config.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

export async function connectRedis() {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("Redis Connected");
    }
  } catch (error) {
    console.error("Redis connection error:", error);
    process.exit(1);
  }
}
