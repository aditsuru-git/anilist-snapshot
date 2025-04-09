import mongoose from "mongoose";
import { Schema } from "mongoose";

const animeSchema = new Schema([
	{
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
			index: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		avatar: {
			type: String,
			required: true,
		},
	},
]);

const Anime = mongoose.model("Anime", animeSchema);

export { Anime };
