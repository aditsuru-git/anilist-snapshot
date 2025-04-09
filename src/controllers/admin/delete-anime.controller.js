import { asyncHandler } from "../../utils/asyncHandler.js";
import { Anime } from "../../models/anime.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { deleteResource } from "../../services/cloudinary.service.js";
import { extractPublicId } from "cloudinary-build-url";

const deleteAnime = asyncHandler(async (req, res, next) => {
	const name = req.body?.name;
	if (!name) throw new ApiError(400, "BAD_REQUEST", "Target name is required");
	const anime = await Anime.findOne({ name: name });
	if (!anime) throw new ApiError(401, "Anime_NOT_FOUND", "The anime does not exist");

	try {
		const publicId = extractPublicId(anime.avatar);
		await deleteResource(publicId);
	} catch (error) {
		throw new ApiError(500, "INTERNAL_SERVER_ERROR", "Failed to update user due to an internal error");
	}

	await Anime.deleteOne({ _id: anime._id });

	res.status(200).json(new ApiResponse(200, "Anime deleted successfully"));
});

export { deleteAnime };
