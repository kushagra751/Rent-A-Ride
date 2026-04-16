import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Jwt from "jsonwebtoken";

const buildAuthPayload = async (userDoc) => {
  const accessToken = Jwt.sign({ id: userDoc._id }, process.env.ACCESS_TOKEN, {
    expiresIn: "15m",
  });
  const refreshToken = Jwt.sign({ id: userDoc._id }, process.env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });

  await User.updateOne({ _id: userDoc._id }, { refreshToken });

  const plainUser = userDoc.toObject ? userDoc.toObject() : userDoc;
  const { password, ...rest } = plainUser;

  return {
    ...rest,
    accessToken,
    refreshToken,
  };
};

const getAuthCookieOptions = (overrides = {}) => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieDomain = process.env.COOKIE_DOMAIN;

  return {
    httpOnly: true,
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction,
    ...(cookieDomain ? { domain: cookieDomain } : {}),
    ...overrides,
  };
};

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isUser: true,
    });
    await newUser.save();
    res.status(200).json({ message: "newUser added successfully" });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return next(errorHandler(403, "bad request no header provided"));
  }

  const refreshToken = req.headers.authorization.split(" ")[1].split(",")[0];

  if (!refreshToken) {
    return next(errorHandler(401, "You are not authenticated"));
  }

  try {
    const decoded = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const user = await User.findById(decoded.id);

    if (!user) return next(errorHandler(403, "Invalid refresh token"));
    if (user.refreshToken !== refreshToken) {
      return next(errorHandler(403, "Invalid refresh token"));
    }

    const responsePayload = await buildAuthPayload(user);

    res
      .cookie(
        "access_token",
        responsePayload.accessToken,
        getAuthCookieOptions({ maxAge: 900000 })
      )
      .cookie(
        "refresh_token",
        responsePayload.refreshToken,
        getAuthCookieOptions({ maxAge: 604800000 })
      )
      .status(200)
      .json({
        accessToken: responsePayload.accessToken,
        refreshToken: responsePayload.refreshToken,
      });
  } catch (error) {
    next(errorHandler(500, "error in refreshToken controller in server"));
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "user not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "wrong credentials"));

    const responsePayload = await buildAuthPayload(validUser);
    req.user = {
      ...responsePayload,
    };

    res.status(200).json(responsePayload);
    next();
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body || {};

    if (!email || !name) {
      return next(errorHandler(400, "Google account details are missing"));
    }

    const existingUser = await User.findOne({ email });

    if (existingUser && !existingUser.isUser) {
      return next(errorHandler(409, "email already in use as a vendor"));
    }

    let user = existingUser;

    if (!user) {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      user = await User.create({
        profilePicture: photo,
        password: hashedPassword,
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8),
        email,
        isUser: true,
      });
    } else if (photo && user.profilePicture !== photo) {
      user.profilePicture = photo;
      await user.save();
    }

    const responsePayload = await buildAuthPayload(user);

    res
      .cookie(
        "access_token",
        responsePayload.accessToken,
        getAuthCookieOptions({ maxAge: 900000 })
      )
      .status(200)
      .json(responsePayload);
  } catch (error) {
    next(error);
  }
};
