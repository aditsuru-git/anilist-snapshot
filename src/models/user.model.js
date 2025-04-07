import mongoose from "mongoose";
import { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
			lowercase: true,
			trim: true,
			index: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			lowercase: true,
			trim: true,
			index: true,
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
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
	},
	{
		timestamps: true,
	},
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 12);
	next();
});

userSchema.methods.matchPassword = async function (incomingPassword) {
	return await bcrypt.compare(incomingPassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			username: this.username,
			name: this.name,
			role: this.role,
			email: this.email,
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
		},
	);
};

userSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
		},
	);
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
