import { Resend } from "resend";

const resend = new Resend(`${process.env.RESEND_API_KEY}`);

const sendEmail = async (options) => {
	const { data } = await resend.emails.send({
		from: "Acme <onboarding@resend.dev>",
		to: options.email,
		subject: options.subject,
		html: "<strong>it works!</strong>",
	});

	console.log(data);
};

export default sendEmail;
