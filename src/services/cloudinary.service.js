import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(localFilePath) {
	if (!fs.existsSync(localFilePath)) throw new Error("Coudln't access the file");
	const response = await cloudinary.uploader.upload(localFilePath, {
		resource_type: "auto",
	});

	if (!response?.url) throw new Error("Coudln't upload the file");
	fs.unlinkSync(localFilePath);
	return response.url;
}

async function deleteResource(publicId) {
	await cloudinary.api.delete_resources([publicId]);
}

export { uploadToCloudinary, deleteResource };
