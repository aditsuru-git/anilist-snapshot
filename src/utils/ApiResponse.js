class ApiResponse {
	constructor(status = 200, message = "success", data = null) {
		this.status = status;
		this.success = this.status < 400;
		this.message = message;
		this.data = data;
	}
}

export { ApiResponse };
