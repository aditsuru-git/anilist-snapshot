import { Router } from "express";

const router = Router();

// get anime list
import { getAnimeList } from "../controllers/anime/get-anilist.controller.js";
router.route("/anilist").get(getAnimeList);

// get wishlist
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { getWishList } from "../controllers/anime/get-wishlist.controller.js";
router.route("/wishlist").get(authenticateUser, getWishList);

export default router;
