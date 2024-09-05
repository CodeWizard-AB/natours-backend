import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const resend = new Resend(process.env.RESEND_API_KEY);

export default class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(" ")[0];
		this.url = url;
		this.from = `Acme ${process.env.EMAIL_FROM}`;
	}

	async send(template, subject) {
		await resend.emails.send({
			from: this.from,
			to: this.to,
			subject: subject,
			text: template,
			html: "<p>HTML Content<p>",
		});
	}

	async sendWelcome() {
		await this.send("Welcome", "Welcome to the Natours Family");
	}

	async sendPasswordReset() {
		await this.send(
			"passwordReset",
			"Your password reset token (valid for only 10 minutes)"
		);
	}
}
