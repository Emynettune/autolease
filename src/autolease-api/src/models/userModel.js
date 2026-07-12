"use strict";

const data_source = require("../database/data-source");
const helpers = require("../utils/helpers");
const cloudinary = require("../utils/cloudinary");
const sessionService = require("../services/sessionService");

const userModel = {
    async getProfile(userId) {
        const user = await (0, data_source.getRepo)('User').findOne({ where: { id: userId } });
        if (!user)
            throw new helpers.AppError('User not found', 404);
        return (0, helpers.sanitizeUser)(user);
    },
    async updateProfile(userId, data) {
        const userRepo = (0, data_source.getRepo)('User');
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new helpers.AppError('User not found', 404);
        Object.assign(user, data);
        return (0, helpers.sanitizeUser)(await userRepo.save(user));
    },
    async uploadProfilePicture(userId, buffer) {
        const userRepo = (0, data_source.getRepo)('User');
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new helpers.AppError('User not found', 404);
        const { url } = await (0, cloudinary.uploadImage)(buffer, 'profiles');
        user.profilePicture = url;
        return (0, helpers.sanitizeUser)(await userRepo.save(user));
    },
    async getWallet(userId) {
        const wallet = await (0, data_source.getRepo)('Wallet').findOne({ where: { userId } });
        if (!wallet)
            throw new helpers.AppError('Wallet not found', 404);
        return wallet;
    },
    async getWalletTransactions(userId, query) {
        const { page, limit, skip } = (0, helpers.parsePagination)(query);
        const wallet = await (0, data_source.getRepo)('Wallet').findOne({ where: { userId } });
        if (!wallet)
            throw new helpers.AppError('Wallet not found', 404);
        const [items, total] = await (0, data_source.getRepo)('WalletTransaction').findAndCount({
            where: { walletId: wallet.id }, order: { createdAt: 'DESC' }, skip, take: limit,
        });
        return { items, meta: (0, helpers.buildMeta)(total, page, limit) };
    },
    async getRentalHistory(userId, query) {
        const { page, limit, skip } = (0, helpers.parsePagination)(query);
        const [items, total] = await (0, data_source.getRepo)('Booking').findAndCount({
            where: { customerId: userId },
            relations: ['vehicle', 'vehicle.images', 'payment'],
            order: { createdAt: 'DESC' }, skip, take: limit,
        });
        return { items, meta: (0, helpers.buildMeta)(total, page, limit) };
    },
    async getPaymentHistory(userId, query) {
        const { page, limit, skip } = (0, helpers.parsePagination)(query);
        const [items, total] = await (0, data_source.getRepo)('Payment')
            .createQueryBuilder('payment')
            .innerJoin('payment.booking', 'booking')
            .where('booking.customerId = :userId', { userId })
            .orderBy('payment.createdAt', 'DESC')
            .skip(skip).take(limit)
            .getManyAndCount();
        return { items, meta: (0, helpers.buildMeta)(total, page, limit) };
    },
    async getDeviceSessions(userId) {
        return sessionService.sessionService.list(userId);
    },
    async revokeDeviceSession(userId, sessionId) {
        const revoked = await sessionService.sessionService.revoke(userId, sessionId);
        if (!revoked)
            throw new helpers.AppError('Device session not found', 404);
    },
};

module.exports = { userModel: userModel };
