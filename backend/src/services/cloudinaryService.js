import { v2 as cloudinary } from "cloudinary";

const CLOUD_NAME = String(process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const API_KEY = String(process.env.CLOUDINARY_API_KEY || "").trim();
const API_SECRET = String(process.env.CLOUDINARY_API_SECRET || "").trim();

export const isCloudinaryConfigured = () => Boolean(CLOUD_NAME && API_KEY && API_SECRET);

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
  });
}

export const uploadAiImageDataUri = async (dataUri, options = {}) => {
  if (!isCloudinaryConfigured()) {
    return null;
  }

  if (!String(dataUri || "").startsWith("data:image/")) {
    throw new Error("Invalid image data URI for Cloudinary upload.");
  }

  const uploadResult = await cloudinary.uploader.upload(dataUri, {
    folder: "flower-custom-ai/ai-preview",
    resource_type: "image",
    overwrite: false,
    ...options
  });

  return {
    url: uploadResult.secure_url || uploadResult.url || "",
    publicId: uploadResult.public_id || ""
  };
};
