import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// register user
import { registerUser } from "../controllers/user/register-user.controller.js";
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
import { loginUser } from "../controllers/user/login-user.controller.js";
router.route("/login").post(loginUser);

// logout user
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { logoutUser } from "../controllers/user/logout-user.controller.js";
router.route("/logout").post(authenticateUser, logoutUser);

// refresh access token
import { refreshAccessToken } from "../controllers/user/refresh-user-token.controller.js";
router.route("/refresh-token").post(refreshAccessToken);

// change user role
import { changeUserRole } from "../controllers/admin/change-user-role.controller.js";
import { adminAuthorization } from "../middlewares/admin.middleware.js";
router.route("/change-role").post(authenticateUser, adminAuthorization, changeUserRole);

export default router;
