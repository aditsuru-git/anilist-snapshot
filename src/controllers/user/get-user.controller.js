import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id).select("-password -__v -_id -refreshToken -createdAt -updatedAt");
	if (!user) throw new ApiError(401, "USER_NOT_FOUND", "The user does not exist");

	res.status(200).json(new ApiResponse(200, `Welcome ${user.name}`, { user }));
});

export { getUser };
