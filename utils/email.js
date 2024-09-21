const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Emanuele Ferrero <${process.env.EMAIL_FROM}>`;
  }

  newTranspor() {
    if (process.env.NODE_ENV === 'production') {
      // mailgun
      return nodemailer.createTransport(
        mg({
          auth: {
            api_key: process.env.MAILGUN_API,
            domain: process.env.MAILGUN_DOMAIN
          },
          secure: false
        })
      );
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      PORT: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    // render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );

    // define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html)
    };

    // create a transport and send email
    await this.newTranspor().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'password-reset',
      'Your password reset token (valid for only 10 minute)'
    );
  }
};
