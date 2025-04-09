import { asyncHandler } from "../../utils/asyncHandler.js";
import { Anime } from "../../models/anime.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const getAnimeList = asyncHandler(async (req, res, next) => {
	const animeList = await Anime.find({}).select("-__v");
	if (!animeList) throw new ApiError(500, "INTERNAL_SERVER_ERROR", "Failed to fetch anime list");

	res.status(200).json(new ApiResponse(200, `Success`, { animeList }));
});

export { getAnimeList };
