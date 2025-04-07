import { connect } from "./db/connect.js";
import { app } from "./app.js";
import { logger } from "@aditsuru/logger";

async function main() {
	await connect();
	app.listen(process.env.PORT || 8000, () => {
		logger.info(`Server started at port: ${process.env.PORT || 8000}`);
	});
	app.on("error", (error) => {
		logger.error(error);
		process.exit(1);
	});
}

main();
