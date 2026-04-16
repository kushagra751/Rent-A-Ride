import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import User from "../models/userModel.js";

const parseAuthorizationTokens = (authorizationHeader) => {
  const bearerValue = authorizationHeader?.split(" ")[1] || "";
  const [refreshToken = "", accessToken = ""] = bearerValue.split(",");

  return {
    refreshToken: refreshToken.trim(),
    accessToken: accessToken.trim(),
  };
};

const authenticateWithRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    throw errorHandler(401, "You are not authenticated");
  }

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    throw errorHandler(403, "Invalid refresh token");
  }

  return decoded.id;
};

export const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return next(errorHandler(403, "Bad request, no authorization header provided"));
    }

    const { refreshToken, accessToken } = parseAuthorizationTokens(req.headers.authorization);

    if (!accessToken) {
      req.user = await authenticateWithRefreshToken(refreshToken);
      return next();
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
      req.user = decoded.id;
      return next();
    } catch (error) {
      if (error.name !== "TokenExpiredError") {
        return next(errorHandler(403, "Token is not valid"));
      }

      req.user = await authenticateWithRefreshToken(refreshToken);
      return next();
    }
  } catch (error) {
    return next(error.statusCode ? error : errorHandler(401, error.message || "Authentication failed"));
  }
};
