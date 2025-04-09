import { asyncHandler } from "../../utils/asyncHandler.js";
import { Anime } from "../../models/anime.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadToCloudinary, deleteResource } from "../../services/cloudinary.service.js";
import mongoose from "mongoose";
import path from "path";
import { logger } from "@aditsuru/logger";
import { extractPublicId } from "cloudinary-build-url";

const updateAnime = asyncHandler(async (req, res, next) => {
	const { name, description, old_name } = req.body;

	if (!old_name) throw new ApiError(400, "BAD_REQUEST", "Target name is required.");

	const localAvatarFilePath = req.files?.avatar?.[0]?.path;
	if (!(description || name || localAvatarFilePath))
		throw new ApiError(400, "BAD_REQUEST", "No fields provided for update.");

	const anime = await Anime.findOne({
		name: old_name,
	});
	if (!anime) throw new ApiError(404, "NOT_FOUND", "anime not found.");

	// update name or description
	if (name) anime.name = name;
	if (description) anime.description = description;

	// change avatar
	let oldAvatarPublicId = null;
	let newAvatarUrl = null;

	if (localAvatarFilePath) {
		try {
			// get old avatar public ID
			if (anime.avatar) {
				oldAvatarPublicId = extractPublicId(anime.avatar);
			}

			// Upload new avatar to cloudinary
			newAvatarUrl = await uploadToCloudinary(path.resolve(localAvatarFilePath));
			anime.avatar = newAvatarUrl;
		} catch (error) {
			logger.error(error);
			throw new ApiError(500, "SERVER_ERROR", "Failed to upload avatar");
		}
	}

	// save anime and validate credentials
	try {
		await anime.save();

		// delete the old avatar if it exists
		if (oldAvatarPublicId) {
			try {
				await deleteResource(oldAvatarPublicId);
			} catch (deleteError) {
				logger.error(`Failed to delete old avatar ${oldAvatarPublicId}:`, deleteError);
			}
		}

		// Return a sanitized anime object without sensitive fields
		const sanitizedAnimeObject = anime.toObject();

		delete sanitizedAnimeObject.__v;

		res.status(200).json(new ApiResponse(200, "Successfully updated anime", sanitizedAnimeObject));
	} catch (error) {
		// Clean up if new avatar was uploaded but anime save failed
		if (newAvatarUrl) {
			const newAvatarPublicId = extractPublicId(newAvatarUrl);
			await deleteResource(newAvatarPublicId);
		}

		if (error instanceof mongoose.Error.ValidationError) {
			// extract error messages from validation error object
			let validationErrors = {};
			for (const key in error.errors) {
				validationErrors[key] = error.errors[key].message;
			}
			throw new ApiError(409, "INVALID_FORMAT", validationErrors);
		} else if (error.code === 11000) {
			let field = "Field";
			if (error.message.includes("name")) field = "Name";
			throw new ApiError(409, "DUPLICATE_ENTRY", `${field} already exists.`);
		} else {
			throw new ApiError(500, "INTERNAL_SERVER_ERROR", "Failed to update adnime due to an internal error");
		}
	}
});

export { updateAnime };
