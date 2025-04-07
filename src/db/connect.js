import mongoose from "mongoose";
import { logger } from "@aditsuru/logger";

async function connect() {
	try {
		const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
		logger.info(`DB connected successfully`, {
			uri: process.env.MONGODB_URI,
			host: connectionInstance.connection.host,
			DB_NAME: connectionInstance.connection.name,
			port: connectionInstance.connection.port,
		});
	} catch (error) {
		logger.error(error);
		process.exit(1);
	}
}

export { connect };
