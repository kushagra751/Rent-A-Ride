import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary, uploader, config } from "cloudinary";


export const cloudinaryConfig = (req, res, next) => {
  const cloudName = process.env.CLOUD_NAME?.trim();
  const apiKey = process.env.API_KEY?.trim();
  const apiSecret = process.env.API_SECRET?.trim();

  config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
   
  });

  next();
};

export { uploader, cloudinary };
