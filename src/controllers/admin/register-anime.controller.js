import { asyncHandler } from "../../utils/asyncHandler.js";
import { Anime } from "../../models/anime.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadToCloudinary, deleteResource } from "../../services/cloudinary.service.js";
import mongoose from "mongoose";
import path from "path";
import { logger } from "@aditsuru/logger";
import { extractPublicId } from "cloudinary-build-url";

const registerAnime = asyncHandler(async (req, res, next) => {
	const { name, description } = req.body;

	// validate required fields
	[name, description].forEach((value, index) => {
		const fields = ["Name", "Description"];
		if (!value) throw new ApiError(409, "INVALID_FORMAT", `${fields[index]} is required`);
	});

	// validate avatar file
	const avatarLocalFilePath = req.files?.avatar?.[0]?.path;
	if (!avatarLocalFilePath) throw new ApiError(409, "INVALID_FORMAT", `Avatar is required`);

	// upload to cloudinary
	let avatarUrl;
	try {
		avatarUrl = await uploadToCloudinary(path.resolve(avatarLocalFilePath));
	} catch (error) {
		logger.error(error);
		throw new ApiError(500, "SERVER_ERROR", "Failed to upload avatar");
	}

	// register anime to database
	let anime;
	try {
		anime = await Anime.create({
			name,
			description,
			avatar: avatarUrl,
		});
	} catch (error) {
		const publicId = extractPublicId(avatarUrl);
		await deleteResource(publicId);

		if (error instanceof mongoose.Error.ValidationError) {
			// extract error messages from validation error object
			let validationErrors = {};
			for (const key in error.errors) {
				validationErrors[key] = error.errors[key].message;
			}
			throw new ApiError(409, "INVALID_FORMAT", validationErrors);
		} else if (error.code === 11000) {
			let field = "Field";
			if (error.message.includes("username")) field = "Username";
			throw new ApiError(409, "DUPLICATE_ENTRY", `${field} already exists.`);
		} else {
			throw new ApiError(500, "INTERNAL_SERVER_ERROR", "Failed to register anime due to an internal error");
		}
	}

	// send back response
	res.status(201).json(
		new ApiResponse(201, "Successfully registered anime", {
			name: anime.name,
			description: anime.description,
			avatar: anime.avatar,
		}),
	);
});

export { registerAnime };
