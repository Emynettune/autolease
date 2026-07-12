"use strict";
const crypto = require("crypto");
const email = require("../utils/email");

function generateCode() {
    return String(crypto.randomInt(100000, 999999));
}

const twoFactorService = {
    async issueCode(user, userRepo) {
        const code = generateCode();
        user.twoFactorCode = code;
        user.twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000);
        await userRepo.save(user);
        await (0, email.sendEmail)(user.email, 'Your AutoLease login code', `<p>Hi ${user.firstName},</p><p>Your login code is <strong>${code}</strong>. It expires in 10 minutes.</p>`);
    },
    async verifyCode(user, code, userRepo) {
        if (!user.twoFactorCode || !user.twoFactorExpires || user.twoFactorExpires < new Date() || user.twoFactorCode !== code) {
            return false;
        }
        user.twoFactorCode = null;
        user.twoFactorExpires = null;
        await userRepo.save(user);
        return true;
    },
};

module.exports = { twoFactorService: twoFactorService };
