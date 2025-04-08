import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const changeUserRole = asyncHandler(async (req, res, next) => {
	const targetUsername = req.body?.username;
	const newRole = req.body?.role;
	const password = req.body?.password;

	if (!newRole) throw new ApiError(400, "ROLE_REQUIRED", "Role is required");
	if (!targetUsername) throw new ApiError(400, "USERNAME_REQUIRED", "Target username is required");
	if (!(await req.user.matchPassword(password))) throw new ApiError(401, "INVALID_PASSWORD", "Invalid password");

	const user = await User.findOne({ username: targetUsername });
	if (!user) throw new ApiError(404, "USER_NOT_FOUND", "User not found");
	if (user.username === req.user.username)
		throw new ApiError(400, "INVALID_REQUEST", "You cannot change your own role");
	user.role = newRole;
	await user.save();

	res.status(200).json(new ApiResponse(200, "Role updated successfully"));
});

export { changeUserRole };
