import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a base64 / data-URI image to Cloudinary.
 * Used for member photos, gym logos and documents.
 */
export async function uploadImage(dataUri, folder = "fithub") {
  const res = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });
  return { url: res.secure_url, publicId: res.public_id };
}

export async function deleteImage(publicId) {
  if (!publicId) return;
  return cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
