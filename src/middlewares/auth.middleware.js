import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const authenticateUser = asyncHandler(async (req, res, next) => {
	const incomingAccessToken = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "");
	if (!incomingAccessToken) throw new ApiError(401, "UNAUTHORIZED", "Access token is invalid or expired");

	try {
		const user = jwt.verify(incomingAccessToken, process.env.ACCESS_TOKEN_SECRET);
		req.user = user;
		next();
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError) {
			throw new ApiError(401, "UNAUTHORIZED", "Access token has expired.");
		}
		if (error instanceof jwt.JsonWebTokenError) {
			throw new ApiError(401, "UNAUTHORIZED", "Access token is invalid.");
		}
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError(500, "INTERNAL_SERVER_ERROR", "An authentication error occurred.");
	}
});

export { authenticateUser };
