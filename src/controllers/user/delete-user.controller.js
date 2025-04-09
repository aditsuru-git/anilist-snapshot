import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const deleteUser = asyncHandler(async (req, res, next) => {
	const password = req.body?.password;
	if (!password) throw new ApiError(400, "PASSWORD_REQUIRED", "Password is required");
	const user = await User.findById(req.user._id);
	if (!user) throw new ApiError(401, "USER_NOT_FOUND", "The user does not exist");

	if (!(await user.matchPassword(password))) throw new ApiError(401, "INVALID_PASSWORD", "Password is incorrect");
	await User.deleteOne({ _id: user._id });

	res.status(200).json(new ApiResponse(200, "User deleted successfully"));
});

export { deleteUser };
