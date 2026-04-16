import bcryptjs from "bcryptjs";
import Jwt from "jsonwebtoken";
import User from "../../models/userModel.js";
import { errorHandler } from "../../utils/error.js";

const DEFAULT_ADMIN_EMAIL = "admin@demo.com";
const DEFAULT_ADMIN_PASSWORD = "admin123";
const DEFAULT_ADMIN_USERNAME = "admin_panel";

const buildAdminAuthPayload = async (userDoc) => {
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

const ensureDefaultAdmin = async (email, password) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedPassword = String(password || "").trim();

  if (
    normalizedEmail !== DEFAULT_ADMIN_EMAIL ||
    normalizedPassword !== DEFAULT_ADMIN_PASSWORD
  ) {
    return null;
  }

  let adminUser = await User.findOne({ email: DEFAULT_ADMIN_EMAIL });

  if (!adminUser) {
    let username = DEFAULT_ADMIN_USERNAME;
    let suffix = 1;

    while (await User.findOne({ username })) {
      username = `${DEFAULT_ADMIN_USERNAME}${suffix}`;
      suffix += 1;
    }

    const hashedPassword = bcryptjs.hashSync(DEFAULT_ADMIN_PASSWORD, 10);
    adminUser = await User.create({
      username,
      email: DEFAULT_ADMIN_EMAIL,
      phoneNumber: "8888888888",
      password: hashedPassword,
      isUser: true,
      isAdmin: true,
    });
  } else if (!adminUser.isAdmin) {
    adminUser.isAdmin = true;
    if (!adminUser.isUser) {
      adminUser.isUser = true;
    }
    adminUser.password = bcryptjs.hashSync(DEFAULT_ADMIN_PASSWORD, 10);
    await adminUser.save();
  }

  return adminUser;
};

export const adminSignIn = async (req, res, next) => {
  const { email, password } = req.body || {};

  try {
    let adminUser = await User.findOne({ email });

    if (!adminUser) {
      adminUser = await ensureDefaultAdmin(email, password);
    }

    if (!adminUser) {
      return next(errorHandler(404, "admin not found"));
    }

    const validPassword = bcryptjs.compareSync(password, adminUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "wrong credentials"));
    }

    if (!adminUser.isAdmin) {
      return next(errorHandler(403, "only access for admins"));
    }

    const responsePayload = await buildAdminAuthPayload(adminUser);

    res.status(200).json(responsePayload);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const adminAuth = async (req,res,next)=> {
    try{
        if(req.user.isAdmin){
            res.status(200).json({message:"admin loged in successfully"})
        }
        else{
            res.status(403).json({message:"only acces for admins"})
        }
        
    }
    catch(error){
        next(error)
    }
}

export const adminProfiile = async (req,res,next)=> {
    try{

    }
    catch(error){
        next(error)
    }
}
