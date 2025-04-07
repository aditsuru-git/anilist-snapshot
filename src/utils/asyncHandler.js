import { logger } from "@aditsuru/logger";
import { ApiError } from "./ApiError.js";

export const asyncHandler = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch((error) => {
		const statusCode = error instanceof ApiError && error?.status ? error.status : 500;

		const responseBody =
			error instanceof ApiError
				? error
				: {
						status: statusCode,
						success: false,
						error: {
							code: "UNEXPECTED_ERROR",
							message: "An unexpected error occurred.",
						},
					};

		if (!(error instanceof ApiError)) {
			logger.error(error, "Unexpected error caught by asyncHandler");
		}
		res.status(statusCode).json(responseBody);
	});
};
