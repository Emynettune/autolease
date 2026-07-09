"use strict";

const nodemailer = __importDefault(require("nodemailer"));
const env = require("../config/env");
const transporter = nodemailer.default.createTransport({
    host: env.env.smtp.host,
    port: env.env.smtp.port,
    secure: false,
    auth: env.env.smtp.user ? { user: env.env.smtp.user, pass: env.env.smtp.pass } : undefined,
});
async function sendEmail(to, subject, html) {
    if (!env.env.smtp.user) {
        console.log(`[Email] To: ${to} | Subject: ${subject}`);
        return;
    }
    await transporter.sendMail({ from: env.env.smtp.from, to, subject, html });
}

module.exports = { sendEmail };
//# sourceMappingURL=email.js.map