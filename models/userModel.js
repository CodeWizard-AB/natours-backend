import { model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "A user must have a name"],
		},
		email: {
			type: String,
			required: [true, "A user must have a email address"],
			unique: true,
			lowercase: true,
			validate: [validator.isEmail, "Invalid email address"],
		},
		photo: String,
		password: {
			type: String,
			required: [true, "A user must have a password"],
			minLength: [8, "A password must have minimun 8 characters"],
			select: false,
		},
		confirmPassword: {
			type: String,
			required: [true, "A user must have a confirm passsword"],
			validate: {
				validator(value) {
					return value === this.password;
				},
				message: "Confirm password doesn't match",
			},
		},
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
		role: {
			type: String,
			enum: ["admin", "user", "guide", "lead-guide"],
			default: "user",
		},
		passwordChangedAt: Date,
		passwordResetToken: String,
		passwordResetExpires: Date,
	},
	{ timestamps: true }
);

// * DOCUMENT MIDDLEWARE
userSchema.pre("save", async function (next) {
	if (this.isModified("password") || this.isNew) {
		this.password = await bcrypt.hash(this.password, 10);
		this.confirmPassword = undefined;
	}
	next();
});

userSchema.pre("save", async function (next) {
	if (this.isModified("password") || this.isNew) {
		this.passwordChangedAt = Date.now() - 1000;
	}
	next();
});

// * QUERY MIDDLEWARE
userSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

// * DOCUMENT INSTANCE METHODS
userSchema.methods.validatePassword = async function (
	userPassword,
	hashPassword
) {
	return await bcrypt.compare(userPassword, hashPassword);
};

userSchema.methods.validateChangedPassword = function (jwtTimeStamp) {
	if (this.passwordChangedAt) {
		const changedTimeStamp = +(this.passwordChangedAt.getTime() / 1000);
		return changedTimeStamp > jwtTimeStamp;
	} else return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(32).toString("hex");
	this.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

const User = model("User", userSchema);

export default User;
