"use strict";

const fs = require("fs");
const path = require("path");
function escapeHtml(value) {
    if (value === undefined || value === null)
        return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
function renderTemplate(templateName, variables) {
    const templatePath = path.join(__dirname, '..', 'views', 'emails', `${templateName}.html`);
    const template = fs.readFileSync(templatePath, 'utf8');
    return template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_match, key) => {
        const value = variables[key];
        return escapeHtml(value);
    });
}
function renderSignupEmail(firstName, loginUrl) {
    return renderTemplate('signup', { firstName, loginUrl });
}
function renderVerifyEmail(firstName, verificationUrl) {
    return renderTemplate('verify-email', { firstName, verificationUrl });
}
function renderResendOtpEmail(firstName, otp, expiryMinutes) {
    return renderTemplate('resend-otp', { firstName, otp, expiryMinutes });
}
function renderMakeAdminEmail(firstName, loginUrl) {
    return renderTemplate('make-admin', { firstName, loginUrl });
}
function renderWalletCreatedEmail(firstName, dashboardUrl) {
    return renderTemplate('wallet-created', { firstName, dashboardUrl });
}

module.exports = {
    renderSignupEmail,
    renderVerifyEmail,
    renderResendOtpEmail,
    renderMakeAdminEmail,
    renderWalletCreatedEmail
};
