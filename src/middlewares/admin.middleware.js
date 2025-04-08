import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const adminAuthorization = asyncHandler(async (req, res, next) => {
	const admin = await User.findById(req.user._id);
	if (!admin) throw new ApiError(404, "USER_NOT_FOUND", "User not found");
	if (admin.role !== "admin") throw new ApiError(403, "ACCESS_DENIED", "Access denied");
	req.user = admin;
	next();
});

export { adminAuthorization };
