import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { JSON_LIMIT, URL_ENCODED_LIMIT } from "./constants.js";
import { upload } from "./middlewares/multer.middleware.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(
	express.json({
		limit: JSON_LIMIT,
	}),
);
app.use(
	express.urlencoded({
		extended: true,
		limit: URL_ENCODED_LIMIT,
	}),
);

app.use(express.static("public"));
app.use(cookieParser());

// user routes
import userRouter from "./routes/user.route.js";
app.use("/api/v1/user", userRouter);

export { app };
