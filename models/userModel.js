import { model, Schema } from "mongoose";
import validator from "validator";

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
	},
	{ timestamps: true }
);

const User = model("User", userSchema);

export default User;
