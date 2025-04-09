import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { deleteResource } from "../../services/cloudinary.service.js";
import { extractPublicId } from "cloudinary-build-url";

const deleteUser = asyncHandler(async (req, res, next) => {
	const password = req.body?.password;
	if (!password) throw new ApiError(400, "PASSWORD_REQUIRED", "Password is required");
	const user = await User.findById(req.user._id);
	if (!user) throw new ApiError(401, "USER_NOT_FOUND", "The user does not exist");

	if (!(await user.matchPassword(password))) throw new ApiError(401, "INVALID_PASSWORD", "Password is incorrect");
	try {
		const publicId = extractPublicId(user.avatar);
		await deleteResource(publicId);
	} catch (error) {
		throw new ApiError(500, "INTERNAL_SERVER_ERROR", "Failed to update user due to an internal error");
	}
	await User.deleteOne({ _id: user._id });

	res.status(200).json(new ApiResponse(200, "User deleted successfully"));
});

export { deleteUser };
