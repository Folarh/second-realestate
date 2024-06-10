import cloudinary from "cloudinary";

async function uploadImages(imageFiles) {
  const uploadPromises = imageFiles.map(async (image) => {
    try {
      const b64 = Buffer.from(image.buffer).toString("base64");
      let dataURI = "data:" + image.mimetype + ";base64," + b64;
      const res = await cloudinary.uploader.upload(dataURI);
      return res.secure_url;
    } catch (error) {
      throw error;
    }
  });

  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}
export default uploadImages;
