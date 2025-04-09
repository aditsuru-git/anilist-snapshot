import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const getWishList = asyncHandler(async (req, res, next) => {
	const userId = req.user._id;
	const user = await User.findById(userId).populate("wishlist");
	if (!user) {
		throw new ApiError(404, "NOT_FOUND", "User not found");
	}
	res.status(200).json(new ApiResponse(200, `Success`, { animeList: user.wishList || [] }));
});

export { getWishList };
