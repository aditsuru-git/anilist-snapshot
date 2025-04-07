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

// login user
import { loginUser } from "../controllers/login-user.controller.js";
router.route("/login").post(loginUser);

// logout user
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { logoutUser } from "../controllers/logout-user.controller.js";
router.route("/logout").post(authenticateUser, logoutUser);

// refresh access token
import { refreshAccessToken } from "../controllers/refresh-user-token.controller.js";
router.route("/refresh-token").post(refreshAccessToken);

export default router;
