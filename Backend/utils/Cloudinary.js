import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to cloudinary
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Safely remove the locally saved temporary file asynchronously
    if (fs.existsSync(localFilePath)) {
      fs.unlink(localFilePath, (err) => {
        if (err) console.error(`Failed to delete local file: ${localFilePath}`, err);
      });
    }

    return result;
  } catch (error) {
    // If upload fails, safely remove the local file if it exists
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlink(localFilePath, (err) => {
        if (err) console.error(`Failed to clean up file: ${localFilePath}`, err);
      });
    }

    console.error("Cloudinary error detailed:", error);
    return null;
  }
};

export { uploadOnCloudinary };