const Mailjet = require("node-mailjet");
const { convert } = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `CulinaryCharm Grill Restaurant <${process.env.EMAIL_FROM}>`;
  }

  async send(htmlContent, subject) {
    const mailjet = Mailjet.apiConnect(
      process.env.MAILJET_PUBLIC_KEY,
      process.env.MAILJET_SECRET_KEY
    );

    console.log("Public key: " + process.env.MAILJET_PUBLIC_KEY);
    console.log("Private key: " + process.env.MAILJET_SECRET_KEY);

    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_FROM,
            Name: "CulinaryCharm Grill Restaurant",
          },
          To: [
            {
              Email: this.to,
              Name: this.firstName,
            },
          ],
          Subject: subject,
          HTMLPart: convert(htmlContent),
        },
      ],
    });

    try {
      const result = await request;
      console.log(result.body);
    } catch (err) {
      console.error(err.statusCode);
    }
  }

  async sendWelcome() {
    const htmlContent = `<p>Welcome, ${this.firstName}!</p>
      <p>Thank you for choosing CulinaryCharm Grill Restaurant to satisfy your cravings. We're thrilled to have you on board!</p>
      <p>Explore our menu and savor the delightful flavors we have to offer. Click <a href="${this.url}">here</a> to view our menu and start planning your culinary journey.</p>
      <p>If you have any questions or special requests, feel free to reach out to our team. We're here to make your dining experience exceptional.</p>
      <p>Bon appétit!</p>`;

    await this.send(htmlContent, "Welcome to CulinaryCharm Grill Restaurant");
  }

  async sendPasswordReset() {
    const htmlContent = `<p>Your password reset token is ${this.url}. This token is valid for only 10 minutes.</p>`;
    await this.send(htmlContent, "Your password reset token");
  }
};
