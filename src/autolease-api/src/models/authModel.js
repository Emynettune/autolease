"use strict";

const { OAuth2Client } = require("google-auth-library");
const data_source = require("../database/data-source");
const enums = require("../types/enums");
const passwordUtils = require("../utils/password");
const jwt = require("../utils/jwt");
const helpers = require("../utils/helpers");
const emailTemplates = require("../utils/emailTemplates");
const env = require("../config/env");
const queueService = require("../services/queueService");
const twoFactorService = require("../services/twoFactorService");
const sessionService = require("../services/sessionService");
const tokenService = require("../services/tokenService");
const googleClient = new OAuth2Client(env.env.google.clientId);

const issueTokens = async (user, context = {}) => {
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = (0, jwt.signAccessToken)(payload);
    const refreshToken = (0, jwt.signRefreshToken)(payload);
    const savedRefreshToken = await (0, data_source.getRepo)('RefreshToken').save({
        userId: user.id,
        token: refreshToken,
        expiresAt: (0, jwt.getRefreshTokenExpiry)(),
    });
    await sessionService.sessionService.create({
        userId: user.id,
        refreshTokenId: savedRefreshToken.id,
        userAgent: context.userAgent,
        ipAddress: context.ipAddress,
    });
    return { accessToken, refreshToken };
}
const authModel = {
    async register(data) {
        const userRepo = (0, data_source.getRepo)('User');
        const walletRepo = (0, data_source.getRepo)('Wallet');
        const existing = await userRepo.findOne({ where: { email: data.email.toLowerCase() } });
        if (existing)
            throw new helpers.AppError('Email already registered', 409);
        const verificationToken = (0, helpers.generateToken)();
        const user = await userRepo.save(userRepo.create({
            ...data,
            email: data.email.toLowerCase(),
            password: await (0, passwordUtils.hashPassword)(data.password),
            twoFactorEnabled: env.env.security.twoFactorEnabledByDefault,
            emailVerificationToken: verificationToken,
        }));
        await walletRepo.save(walletRepo.create({ userId: user.id }));
        await queueService.queueService.enqueueEmail(user.email, 'Verify your AutoLease account', (0, emailTemplates.renderVerifyEmail)(user.firstName, `${env.env.apiUrl}/api/v1/auth/verify-email?token=${verificationToken}`));
        const tokens = await issueTokens(user);
        return { user: (0, helpers.sanitizeUser)(user), ...tokens };
    },
    async login(email, password, twoFactorCode, context = {}) {
        const userRepo = (0, data_source.getRepo)('User');
        const user = await userRepo.findOne({ where: { email: email.toLowerCase() } });
        if (!user?.password)
            throw new helpers.AppError('Invalid credentials', 401);
        if (user.status === enums.UserStatus.SUSPENDED)
            throw new helpers.AppError('Account suspended', 403);
        if (!(await (0, passwordUtils.comparePassword)(password, user.password)))
            throw new helpers.AppError('Invalid credentials', 401);
        if (user.twoFactorEnabled) {
            if (!twoFactorCode) {
                await twoFactorService.twoFactorService.issueCode(user, userRepo);
                return { twoFactorRequired: true, message: 'Two-factor code sent to your email' };
            }
            const verified = await twoFactorService.twoFactorService.verifyCode(user, twoFactorCode, userRepo);
            if (!verified)
                throw new helpers.AppError('Invalid or expired two-factor code', 401);
        }
        const tokens = await issueTokens(user, context);
        return { user: (0, helpers.sanitizeUser)(user), ...tokens };
    },
    async googleLogin(idToken, role) {
        if (!env.env.google.clientId)
            throw new helpers.AppError('Google OAuth not configured', 503);
        const ticket = await googleClient.verifyIdToken({ idToken, audience: env.env.google.clientId });
        const payload = ticket.getPayload();
        if (!payload?.email)
            throw new helpers.AppError('Invalid Google token', 401);
        const userRepo = (0, data_source.getRepo)('User');
        let user = await userRepo.findOne({ where: [{ googleId: payload.sub }, { email: payload.email.toLowerCase() }] });
        if (!user) {
            user = await userRepo.save(userRepo.create({
                firstName: payload.given_name || 'Google',
                lastName: payload.family_name || 'User',
                email: payload.email.toLowerCase(),
                googleId: payload.sub,
                profilePicture: payload.picture,
                isEmailVerified: payload.email_verified ?? false,
                role: role || enums.UserRole.CUSTOMER,
            }));
            await (0, data_source.getRepo)('Wallet').save((0, data_source.getRepo)('Wallet').create({ userId: user.id }));
        }
        else if (!user.googleId) {
            user.googleId = payload.sub;
            if (payload.picture)
                user.profilePicture = payload.picture;
            await userRepo.save(user);
        }
        if (user.status === enums.UserStatus.SUSPENDED)
            throw new helpers.AppError('Account suspended', 403);
        const tokens = await issueTokens(user);
        return { user: (0, helpers.sanitizeUser)(user), ...tokens };
    },
    async refresh(refreshToken) {
        const repo = (0, data_source.getRepo)('RefreshToken');
        const stored = await repo.findOne({ where: { token: refreshToken, isRevoked: false }, relations: ['user'] });
        if (!stored || stored.expiresAt < new Date())
            throw new helpers.AppError('Invalid refresh token', 401);
        stored.isRevoked = true;
        await repo.save(stored);
        return issueTokens(stored.user);
    },
    async logout(refreshToken, accessPayload) {
        await (0, data_source.getRepo)('RefreshToken').update({ token: refreshToken }, { isRevoked: true });
        if (accessPayload?.jti && accessPayload.exp) {
            await tokenService.tokenService.blacklist({
                tokenId: accessPayload.jti,
                userId: accessPayload.id,
                expiresAt: new Date(accessPayload.exp * 1000),
            });
        }
    },
    async verifyEmail(token) {
        const userRepo = (0, data_source.getRepo)('User');
        const user = await userRepo.findOne({ where: { emailVerificationToken: token } });
        if (!user)
            throw new helpers.AppError('Invalid verification token', 400);
        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        return (0, helpers.sanitizeUser)(await userRepo.save(user));
    },
    async forgotPassword(email) {
        const userRepo = (0, data_source.getRepo)('User');
        const user = await userRepo.findOne({ where: { email: email.toLowerCase() } });
        if (!user)
            return;
        const token = (0, helpers.generateToken)();
        user.passwordResetToken = token;
        user.passwordResetExpires = new Date(Date.now() + 3600000);
        await userRepo.save(user);
        await queueService.queueService.enqueueEmail(user.email, 'Reset password', `<p>Hi ${user.firstName},</p><p><a href="${env.env.clientUrl}/reset-password?token=${token}">Reset Password</a></p>`);
    },
    async resetPassword(token, password) {
        const userRepo = (0, data_source.getRepo)('User');
        const user = await userRepo.findOne({ where: { passwordResetToken: token } });
        if (!user?.passwordResetExpires || user.passwordResetExpires < new Date()) {
            throw new helpers.AppError('Invalid or expired reset token', 400);
        }
        user.password = await (0, passwordUtils.hashPassword)(password);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await userRepo.save(user);
    },
    async changePassword(userId, currentPassword, newPassword) {
        const userRepo = (0, data_source.getRepo)('User');
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user?.password)
            throw new helpers.AppError('User not found', 404);
        if (!(await (0, passwordUtils.comparePassword)(currentPassword, user.password)))
            throw new helpers.AppError('Current password is incorrect', 400);
        user.password = await (0, passwordUtils.hashPassword)(newPassword);
        await userRepo.save(user);
    },
    async setTwoFactor(userId, enabled) {
        const userRepo = (0, data_source.getRepo)('User');
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new helpers.AppError('User not found', 404);
        user.twoFactorEnabled = Boolean(enabled);
        user.twoFactorCode = null;
        user.twoFactorExpires = null;
        return (0, helpers.sanitizeUser)(await userRepo.save(user));
    },
};
async function creditOwnerWallet(manager, ownerId, grossAmount, commissionRate, reference, description) {
    const wallet = await manager.getRepository('Wallet').findOne({
        where: { userId: ownerId },
        lock: { mode: 'pessimistic_write' },
    });
    if (!wallet)
        throw new helpers.AppError('Owner wallet not found', 404);
    const commission = Number((grossAmount * commissionRate).toFixed(2));
    const netAmount = Number((grossAmount - commission).toFixed(2));
    wallet.availableBalance = Number(wallet.availableBalance) + netAmount;
    await manager.getRepository('Wallet').save(wallet);
    const txRepo = manager.getRepository('WalletTransaction');
    await txRepo.save([
        { walletId: wallet.id, type: enums.WalletTransactionType.CREDIT, amount: netAmount, balanceAfter: wallet.availableBalance, description, reference },
        { walletId: wallet.id, type: enums.WalletTransactionType.COMMISSION, amount: commission, balanceAfter: wallet.availableBalance, description: `Platform commission (${commissionRate * 100}%)`, reference },
    ]);
}
async function debitWalletForWithdrawal(manager, userId, amount, reference) {
    const walletRepo = manager.getRepository('Wallet');
    const wallet = await walletRepo.findOne({ where: { userId }, lock: { mode: 'pessimistic_write' } });
    if (!wallet)
        throw new helpers.AppError('Wallet not found', 404);
    if (Number(wallet.availableBalance) < amount)
        throw new helpers.AppError('Insufficient balance', 400);
    wallet.availableBalance = Number(wallet.availableBalance) - amount;
    await walletRepo.save(wallet);
    await manager.getRepository('WalletTransaction').save({
        walletId: wallet.id, type: enums.WalletTransactionType.WITHDRAWAL, amount, balanceAfter: wallet.availableBalance,
        description: 'Withdrawal request', reference,
    });
    return wallet;
}
async function refundWallet(manager, userId, amount, reference) {
    const walletRepo = manager.getRepository('Wallet');
    const wallet = await walletRepo.findOne({ where: { userId }, lock: { mode: 'pessimistic_write' } });
    if (!wallet)
        throw new helpers.AppError('Wallet not found', 404);
    wallet.availableBalance = Number(wallet.availableBalance) + amount;
    await walletRepo.save(wallet);
    await manager.getRepository('WalletTransaction').save({
        walletId: wallet.id, type: enums.WalletTransactionType.REFUND, amount, balanceAfter: wallet.availableBalance,
        description: 'Withdrawal rejected - refund', reference,
    });
}

module.exports = {
    authModel: authModel,
    creditOwnerWallet: creditOwnerWallet,
    debitWalletForWithdrawal: debitWalletForWithdrawal,
    refundWallet: refundWallet,
};
