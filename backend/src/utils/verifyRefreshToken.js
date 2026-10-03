import config from "../config/env.js";
import { redisClient } from "../config/redis.js";
import jwt from "jsonwebtoken"

export const verifyRefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, config.REFRESH_JWT_SECRET);

    const refreshTokenKey = `refresh-token:${decoded.id}`;
    const storedToken = await redisClient.get(refreshTokenKey);

    if (!storedToken) {
      throw new Error("Refresh token not found");
    }

    if (storedToken !== refreshToken) {
      throw new Error("Invalid refresh token");
    }

    return decoded;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Refresh token has expired.");
    }

    if (err.name === "JsonWebTokenError") {
      throw new Error("Invalid refresh token.");
    }

    throw err;
  }
};
