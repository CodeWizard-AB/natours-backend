import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
	const { data, error } = await resend.emails.send({
		from: "Acme <onboarding@resend.dev>",
		to: options.email,
		subject: options.subject,
		html: `<strong>${options.message}</strong>`,
		text: options.message,
	});

	console.log(data, error);
};

export default sendEmail;
