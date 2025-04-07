import mongoose from "mongoose";
import { logger } from "@aditsuru/logger";
import { DB_NAME } from "../constants.js";

async function connect() {
	try {
		const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
		logger.info(`DB connected successfully`, {
			uri: process.env.MONGODB_URI,
			host: connectionInstance.connection.host,
			DB_NAME: connectionInstance.connection.name,
			port: connectionInstance.connection.port,
		});
	} catch (error) {
		logger.error(error);
	}
}

export { connect };
