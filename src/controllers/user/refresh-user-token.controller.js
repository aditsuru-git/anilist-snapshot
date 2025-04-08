import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { generateAccessAndRefreshTokens } from "../../services/generate-tokens.service.js";
import { cookieOptions } from "../../constants.js";

const refreshAccessToken = asyncHandler(async (req, res, next) => {
	const incomingRefreshToken = req.cookies?.refreshToken || req.headers["authorization"]?.replace("Bearer ", "");
	if (!incomingRefreshToken) throw new ApiError(401, "UNAUTHORIZED", "Refresh token is invalid or expired");

	try {
		const jwtUser = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
		const user = await User.findById(jwtUser?._id);
		if (!user) throw new ApiError(401, "USER_NOT_FOUND", "The user does not exist");
		if (incomingRefreshToken !== user?.refreshToken)
			throw new ApiError(401, "UNAUTHORIZED", "Refresh token is invalid or used.");
		const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user);
		res
			.cookie("accessToken", accessToken, cookieOptions)
			.cookie("refreshToken", refreshToken, cookieOptions)
			.status(200)
			.json(new ApiResponse(200, "Access token refreshed"));
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			throw new ApiError(401, "UNAUTHORIZED", "Refresh token has expired.");
		}
		if (error instanceof jwt.JsonWebTokenError) {
			throw new ApiError(401, "UNAUTHORIZED", "Refresh token is invalid.");
		}
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "INTERNAL_SERVER_ERROR", "An authentication error occurred.");
	}
});

export { refreshAccessToken };
