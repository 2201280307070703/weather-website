const nodemailer = require('nodemailer');

const USER = process.env.GMAIL_USER;
const PASSWORD = process.env.GMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: USER,
    pass: PASSWORD,
  },
});

exports.sentEmail = async (to, subject, text) => {
    const mailOptions = {
        from: '"SunnySide" <no-reply@sunnyside.com>',
        to,
        subject,
        text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        throw new Error(`Възникна грешка при изпращане на имейл.`);
    }
};
