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
		abbreviations: [
			{
				type: String,
				lowercase: true,
				unique: true,
			},
		],
	},
]);

animeSchema.methods.searchAnime = async function (queryAnimeName) {
	const query = await this.model("Anime").findOne({
		abbreviations: { $eq: queryAnimeName.toLowerCase() },
	});

	return query?.name || null;
};

const Anime = mongoose.model("Anime", animeSchema);

export { Anime };
