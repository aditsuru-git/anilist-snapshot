import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const logoutUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	if (!user) {
		res.clearCookie("accessToken").clearCookie("refreshToken");
		throw new ApiError(401, "USER_NOT_FOUND", "The user does not exist");
	}
	user.refreshToken = null;
	await user.save({ validateBeforeSave: false });
	res
		.clearCookie("accessToken")
		.clearCookie("refreshToken")
		.status(200)
		.json(new ApiResponse(200, "User logged out successfully"));
});

export { logoutUser };
