import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// register user
import { registerUser } from "../controllers/register-user.controller.js";
router.route("/register").post(
	upload.fields([
		{
			name: "avatar",
			maxCount: 1,
		},
	]),
	registerUser,
);

export default router;
