import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadToCloudinary, deleteResource } from "../../services/cloudinary.service.js";
import mongoose from "mongoose";
import { generateAccessAndRefreshTokens } from "../../services/generate-tokens.service.js";
import { cookieOptions } from "../../constants.js";
import path from "path";
import { logger } from "@aditsuru/logger";
import { extractPublicId } from "cloudinary-build-url";

const registerUser = asyncHandler(async (req, res, next) => {
	const { username, name, email, password } = req.body;

	// validate required fields
	[username, name, email, password].forEach((value, index) => {
		const fields = ["Username", "Name", "Email", "Password"];
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

	// register user to database
	let user;
	try {
		user = await User.create({
			name,
			username,
			email,
			password,
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
			else if (error.message.includes("email")) field = "Email";
			throw new ApiError(409, "DUPLICATE_ENTRY", `${field} already exists.`);
		} else {
			throw new ApiError(500, "INTERNAL_SERVER_ERROR", "Failed to register user due to an internal error");
		}
	}

	// generate tokens
	const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);

	// send back response
	res
		.status(201)
		.cookie("accessToken", accessToken, cookieOptions)
		.cookie("refreshToken", refreshToken, cookieOptions)
		.json(
			new ApiResponse(201, "Successfully registered user", {
				name: user.name,
				username: user.username,
				email: user.email,
				avatar: user.avatar,
			}),
		);
});

export { registerUser };
