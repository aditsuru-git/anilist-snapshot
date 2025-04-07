import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateAccessAndRefreshTokens } from "../services/generate-tokens.service.js";
import { cookieOptions } from "../constants.js";

const loginUser = asyncHandler(async (req, res, next) => {
	const username = req.body?.username;
	const email = req.body?.email;
	const password = req.body?.password;
	const queryCondition = [];
	if (username) queryCondition.push({ username: username.toLowerCase().trim() });
	if (email) queryCondition.push({ email: email.toLowerCase().trim() });

	if (queryCondition.length === 0) throw new ApiError(400, "INVALID_REQUEST", "Missing username or email.");

	const user = await User.findOne({ $or: queryCondition });
	if (!user) throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid username/email or password");

	if (!password) throw new ApiError(400, "INVALID_REQUEST", "Password field is required.");
	if (!(await user.matchPassword(password.toLowerCase().trim())))
		throw new ApiError(401, "INVALID_CREDENTIALS", "Password is incorrect");

	const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);

	res
		.cookie("accessToken", accessToken, cookieOptions)
		.cookie("refreshToken", refreshToken, cookieOptions)
		.status(200)
		.json(new ApiResponse(200, "Login successful"));
});

export { loginUser };
