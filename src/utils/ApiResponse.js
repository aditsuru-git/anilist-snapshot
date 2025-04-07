class ApiResponse {
	constructor(status = 200, message = "success", data = null) {
		this.status = status;
		this.success = this.status < 400;
		this.message = message;
		if (data !== null && data !== undefined) {
			this.data = data;
		}
	}
}

export { ApiResponse };
