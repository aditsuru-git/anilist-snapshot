import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
			lowercase: true,
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			lowercase: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
		avatar: {
			type: String,
			unique: true,
			required: true,
		},
		wishlist: [
			{
				type: Schema.Types.ObjectId,
				ref: "Anime",
			},
		],
		refreshToken: {
			type: String,
			default: null,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	},
);

userSchema.pre("save", async (next) => {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

userSchema.methods.matchPassword = async function (incomingPassword) {
	return await bcrypt.compare(incomingPassword, this.password);
};

userSchema.methods.addAnimeToWishlist = async function (animeName) {
	const anime = await this.model("Anime").findOne({
		name: { $eq: animeName },
	});

	if (!this.wishlist.includes(anime._id)) {
		this.wishlist.push(anime._id);
		await this.save();
	}

	return this.wishlist;
};

const User = mongoose.model("User", userSchema);

export { User };
