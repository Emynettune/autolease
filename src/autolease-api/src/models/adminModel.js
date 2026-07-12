"use strict";

const data_source = require("../database/data-source");
const enums = require("../types/enums");
const helpers = require("../utils/helpers");
const adminModel = {
    async getAnalytics() {
        const [totalUsers, totalVehicles, totalRentals, activeVehicles] = await Promise.all([
            (0, data_source.getRepo)('User').count(),
            (0, data_source.getRepo)('Vehicle').count(),
            (0, data_source.getRepo)('Booking').count({ where: { status: enums.BookingStatus.COMPLETED } }),
            (0, data_source.getRepo)('Vehicle').count({ where: { status: enums.VehicleStatus.ACTIVE, isAvailable: true } }),
        ]);
        const revenue = await (0, data_source.getRepo)('Payment').createQueryBuilder('p')
            .select('COALESCE(SUM(p.amount), 0)', 'total')
            .where('p.status = :status', { status: enums.PaymentStatus.SUCCESS }).getRawOne();
        const totalRevenue = Number(revenue.total);
        return { totalUsers, totalVehicles, activeVehicles, totalRentals, totalRevenue, platformCommission: totalRevenue * 0.1 };
    },
    async suspendUser(userId) {
        const userRepo = (0, data_source.getRepo)('User');
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new helpers.AppError('User not found', 404);
        user.status = enums.UserStatus.SUSPENDED;
        return userRepo.save(user);
    },
    async activateUser(userId) {
        const userRepo = (0, data_source.getRepo)('User');
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new helpers.AppError('User not found', 404);
        user.status = enums.UserStatus.ACTIVE;
        return userRepo.save(user);
    },
    async suspendVehicle(vehicleId) {
        const vehicleRepo = (0, data_source.getRepo)('Vehicle');
        const vehicle = await vehicleRepo.findOne({ where: { id: vehicleId } });
        if (!vehicle)
            throw new helpers.AppError('Vehicle not found', 404);
        vehicle.status = enums.VehicleStatus.SUSPENDED;
        vehicle.isAvailable = false;
        return vehicleRepo.save(vehicle);
    },
    async verifyOwner(userId) {
        const userRepo = (0, data_source.getRepo)('User');
        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new helpers.AppError('User not found', 404);
        user.isOwnerVerified = true;
        return userRepo.save(user);
    },
    async getAllPayments(query) {
        const { page, limit, skip } = (0, helpers.parsePagination)(query);
        const [items, total] = await (0, data_source.getRepo)('Payment').findAndCount({
            relations: ['booking', 'booking.customer'], order: { createdAt: 'DESC' }, skip, take: limit,
        });
        return { items, meta: (0, helpers.buildMeta)(total, page, limit) };
    },
    async getFailedPayments(query) {
        const { page, limit, skip } = (0, helpers.parsePagination)(query);
        const [items, total] = await (0, data_source.getRepo)('Payment').findAndCount({
            where: { status: enums.PaymentStatus.FAILED }, relations: ['booking'],
            order: { createdAt: 'DESC' }, skip, take: limit,
        });
        return { items, meta: (0, helpers.buildMeta)(total, page, limit) };
    },
    async getAuditLogs(query) {
        const { page, limit, skip } = (0, helpers.parsePagination)(query);
        const [items, total] = await (0, data_source.getRepo)('AuditLog').findAndCount({
            order: { createdAt: 'DESC' }, skip, take: limit,
        });
        return { items, meta: (0, helpers.buildMeta)(total, page, limit) };
    },
    async getAllUsers(query) {
        const { page, limit, skip } = (0, helpers.parsePagination)(query);
        const [items, total] = await (0, data_source.getRepo)('User').findAndCount({
            order: { createdAt: 'DESC' }, skip, take: limit,
        });
        return { items, meta: (0, helpers.buildMeta)(total, page, limit) };
    },
};

module.exports = {
    adminModel
};
