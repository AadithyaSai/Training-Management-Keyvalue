const cloudinary = require("cloudinary").v2;
import multer from "multer";
import fs from "fs";
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	api_key: process.env.CLOUDINARY_API_KEY,
});

export async function uploadFile(file: multer.File, folder: string) {
	console.log("File received:", file);
	const fileName = file.originalname;
	const result = await cloudinary.uploader.upload(file.path, {
		folder: folder,
		public_id: fileName, // Use the original file name
		resource_type: "auto",
	});
	console.log("Cloudinary upload result:", result);
	fs.unlinkSync(file.path);
	return result.secure_url;
}

export default cloudinary;
