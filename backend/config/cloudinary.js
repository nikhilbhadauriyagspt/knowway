import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "zy5uodka",
  api_key: process.env.CLOUDINARY_API_KEY || "692581658823166",
  api_secret: process.env.CLOUDINARY_API_SECRET || "LJL54yu4WaQr9PU2h_pdDwJXWv0",
  secure: true,
});

export default cloudinary;
