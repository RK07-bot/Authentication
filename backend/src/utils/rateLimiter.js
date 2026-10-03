import { redisClient } from "../config/redis.js";

const rateLimiter = async ({
    key,
    limit,
    windowSeconds,
}) => {
    const currentCount = await redisClient.incr(key);

    if (currentCount === 1) {
        await redisClient.expire(key, windowSeconds);
    }

    if (currentCount > limit) {
        return {
            allowed: false,
            remaining: 0,
        };
    }

    return {
        allowed: true,
        remaining: limit - currentCount,
    };
};

export default rateLimiter;