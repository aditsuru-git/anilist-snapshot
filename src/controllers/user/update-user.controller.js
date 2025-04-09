import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadToCloudinary, deleteResource } from "../../services/cloudinary.service.js";
import mongoose from "mongoose";
import path from "path";
import { logger } from "@aditsuru/logger";
import { extractPublicId } from "cloudinary-build-url";

const updateUser = asyncHandler(async (req, res, next) => {
	const { username, name, email } = req.body;
	const localAvatarFilePath = req.files?.avatar?.[0]?.path;
	if (!(username || name || email || localAvatarFilePath))
		throw new ApiError(400, "BAD_REQUEST", "No fields provided for update.");

	const user = await User.findById(req.user._id).select("-password -refreshToken");
	if (!user) throw new ApiError(404, "NOT_FOUND", "User not found.");

	// update username, name or email
	if (username) user.username = username;
	if (name) user.name = name;
	if (email) user.email = email;

	// change avatar
	let oldAvatarPublicId = null;
	let newAvatarUrl = null;

	if (localAvatarFilePath) {
		try {
			// get old avatar public ID
			if (user.avatar) {
				oldAvatarPublicId = extractPublicId(user.avatar);
			}

			// Upload new avatar to cloudinary
			newAvatarUrl = await uploadToCloudinary(path.resolve(localAvatarFilePath));
			user.avatar = newAvatarUrl;
		} catch (error) {
			logger.error(error);
			throw new ApiError(500, "SERVER_ERROR", "Failed to upload avatar");
		}
	}

	// save user and validate credentials
	try {
		await user.save();

		// delete the old avatar if it exists
		if (oldAvatarPublicId) {
			try {
				await deleteResource(oldAvatarPublicId);
			} catch (deleteError) {
				logger.error(`Failed to delete old avatar ${oldAvatarPublicId}:`, deleteError);
			}
		}

		// Return a sanitized user object without sensitive fields
		const sanitizedUser = user.toObject();
		delete sanitizedUser.password;
		delete sanitizedUser.__v;
		delete sanitizedUser.refreshToken;

		res.status(200).json(new ApiResponse(200, "Successfully updated user", sanitizedUser));
	} catch (error) {
		// Clean up if new avatar was uploaded but user save failed
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
			if (error.message.includes("username")) field = "Username";
			else if (error.message.includes("email")) field = "Email";
			throw new ApiError(409, "DUPLICATE_ENTRY", `${field} already exists.`);
		} else {
			throw new ApiError(500, "INTERNAL_SERVER_ERROR", "Failed to update user due to an internal error");
		}
	}
});

export { updateUser };
