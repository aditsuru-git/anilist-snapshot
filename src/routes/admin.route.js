import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// change user role
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { adminAuthorization } from "../middlewares/admin.middleware.js";
import { changeUserRole } from "../controllers/admin/change-user-role.controller.js";
router.route("/change-role").post(authenticateUser, adminAuthorization, changeUserRole);

export default router;
