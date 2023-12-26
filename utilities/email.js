const nodemailer = require("nodemailer");
const { convert } = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `CulinaryCharm Grill Restaurant <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST_BREVO,
        port: process.env.EMAIL_PORT_BREVO,

        auth: {
          user: process.env.EMAIL_USERNAME_BREVO,
          pass: process.env.EMAIL_PASSWORD_BREVO,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,

      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(htmlContent, subject) {
    try {
      // Define the email options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html: htmlContent,
        text: convert(htmlContent),
      };

      // Create a transport and send email
      await this.newTransport().sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email:", error);
      // You can choose to log the error or handle it in a way that fits your application
      throw new Error("Failed to send email"); // Propagate the error
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
