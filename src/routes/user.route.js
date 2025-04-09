import { Router } from "express";

const router = Router();

// register user
import { upload } from "../middlewares/multer.middleware.js";
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

// get user
import { getUser } from "../controllers/user/get-user.controller.js";
router.route("/me").get(authenticateUser, getUser);

// delete user
import { deleteUser } from "../controllers/user/delete-user.controller.js";
router.route("/delete").delete(authenticateUser, deleteUser);

// update user
import { updateUser } from "../controllers/user/update-user.controller.js";
router.route("/update").patch(
	authenticateUser,
	upload.fields([
		{
			name: "avatar",
			maxCount: 1,
		},
	]),
	updateUser,
);

export default router;
