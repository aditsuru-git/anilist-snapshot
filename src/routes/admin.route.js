import { Router } from "express";

const router = Router();

// change user role
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { adminAuthorization } from "../middlewares/admin.middleware.js";
import { changeUserRole } from "../controllers/admin/change-user-role.controller.js";
router.route("/change-role").post(authenticateUser, adminAuthorization, changeUserRole);

// register anime
import { registerAnime } from "../controllers/admin/register-anime.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
router.route("/register-anime").post(
	upload.fields([
		{
			name: "avatar",
			maxCount: 1,
		},
	]),
	authenticateUser,
	adminAuthorization,
	registerAnime,
);

// update anime
import { updateAnime } from "../controllers/admin/update-anime.controller.js";
router.route("/update-anime").patch(
	upload.fields([
		{
			name: "avatar",
			maxCount: 1,
		},
	]),
	authenticateUser,
	adminAuthorization,
	updateAnime,
);

// delete anime
import { deleteAnime } from "../controllers/admin/delete-anime.controller.js";
router.route("/delete-anime").delete(authenticateUser, adminAuthorization, deleteAnime);

export default router;
