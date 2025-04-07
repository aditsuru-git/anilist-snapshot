class ApiError extends Error {
	constructor(status = 500, code = "SERVER_ERROR", message = "UNHANDLED SERVER ERROR") {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.success = false;
		this.error = { code: code, message: message };
	}
}

export { ApiError };
