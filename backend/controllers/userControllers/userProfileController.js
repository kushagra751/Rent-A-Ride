import User from "../../models/userModel.js";
import { errorHandler } from "../../utils/error.js";

export const editUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const formData = req.body?.formData || {};

    if (!userId) {
      return next(errorHandler(400, "User id is required"));
    }

    const username = String(formData.username || "").trim();
    const email = String(formData.email || "")
      .trim()
      .toLowerCase();
    const phoneNumber = String(formData.phoneNumber || "").trim();
    const adress = String(formData.adress || "").trim();

    if (!username || !email) {
      return next(errorHandler(400, "Name and email are required"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username,
          email,
          phoneNumber,
          adress,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, refreshToken, ...rest } = updatedUser._doc;
    return res.status(200).json(rest);
  } catch (error) {
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0];
      return next(
        errorHandler(409, `${duplicateField || "Value"} already exists`)
      );
    }

    return next(errorHandler(500, error.message || "Could not update profile"));
  }
};
