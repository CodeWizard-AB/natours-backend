import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	// service: "Gmail",
	secure: false,
	port: process.env.EMAIL_PORT,
	host: process.env.EMAIL_HOST,
	auth: {
		user: process.env.EMAIL_USERNAME,
		pass: process.env.EMAIL_PASSWORD,
	},
});

const sendEmail = async (options) => {
	const data = await transporter.sendMail({
		from: "Madison <maddison53@ethereal.email>",
		to: options.email,
		subject: options.subject,
		text: options.message,
		// html: "",
	});

	console.log(data);
};

export default sendEmail;
