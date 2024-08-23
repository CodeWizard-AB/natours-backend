import { model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

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
		},
		passwordChangedAt: Date,
	},
	{ timestamps: true }
);

// * DOCUMENT MIDDLEWARE
userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
		this.confirmPassword = undefined;
	}
	next();
});

// * DOCUMENT INSTANCE METHODS
userSchema.methods.validatePassword = async function (userPassword) {
	return await bcrypt.compare(userPassword, this.password);
};

userSchema.methods.validateChangedPassword = function (jwtTimeStamp) {
	if (this.passwordChangedAt) {
		const changedTimeStamp = +(this.passwordChangedAt.getTime() / 1000);
		return changedTimeStamp > jwtTimeStamp;
	}
	return false;
};

const User = model("User", userSchema);

export default User;
