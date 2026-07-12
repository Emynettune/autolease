"use strict";

const uuid = require("uuid");
const data_source = require("../database/data-source");
const enums = require("../types/enums");
const helpers = require("../utils/helpers");

const bookingModel = {
    async create(customerId, vehicleId, startDate, endDate) {
        if (new Date(endDate) <= new Date(startDate))
            throw new helpers.AppError('End date must be after start date', 400);
        const totalDays = (0, helpers.calculateDays)(startDate, endDate);
        if (totalDays < 1)
            throw new helpers.AppError('Minimum booking is 1 day', 400);
        return data_source.AppDataSource.transaction(async (manager) => {
            const vehicle = await manager.getRepository('Vehicle').findOne({
                where: { id: vehicleId }, lock: { mode: 'pessimistic_write' },
            });
            if (!vehicle)
                throw new helpers.AppError('Vehicle not found', 404);
            if (vehicle.status === enums.VehicleStatus.SUSPENDED)
                throw new helpers.AppError('Vehicle is suspended', 403);
            if (vehicle.status === enums.VehicleStatus.PAUSED || !vehicle.isAvailable) {
                throw new helpers.AppError('Vehicle is not available for booking', 400);
            }
            const overlapping = await manager.getRepository('Booking').createQueryBuilder('b')
                .where('b.vehicleId = :vehicleId', { vehicleId })
                .andWhere("b.status NOT IN ('cancelled')")
                .andWhere('b.startDate <= :endDate AND b.endDate >= :startDate', { startDate, endDate })
                .getOne();
            if (overlapping)
                throw new helpers.AppError('Vehicle is already booked for these dates', 409);
            const dailyRate = Number(vehicle.dailyPrice);
            const totalAmount = Number((dailyRate * totalDays).toFixed(2));
            const bookingRepo = manager.getRepository('Booking');
            const saved = await bookingRepo.save(bookingRepo.create({
                customerId, vehicleId, startDate, endDate, totalDays, dailyRate, totalAmount,
                status: enums.BookingStatus.AWAITING_PAYMENT,
            }));
            await manager.getRepository('Payment').save(manager.getRepository('Payment').create({
                bookingId: saved.id, amount: totalAmount, status: enums.PaymentStatus.PENDING,
                paystackReference: `AL-${(0, uuid.v4)()}`,
            }));
            return bookingRepo.findOne({ where: { id: saved.id }, relations: ['vehicle', 'payment'] });
        });
    },
    async cancel(bookingId, customerId, reason) {
        const bookingRepo = (0, data_source.getRepo)('Booking');
        const booking = await bookingRepo.findOne({ where: { id: bookingId, customerId }, relations: ['payment'] });
        if (!booking)
            throw new helpers.AppError('Booking not found', 404);
        if ([enums.BookingStatus.COMPLETED, enums.BookingStatus.CANCELLED, enums.BookingStatus.ACTIVE].includes(booking.status)) {
            throw new helpers.AppError(`Cannot cancel booking with status: ${booking.status}`, 400);
        }
        booking.status = enums.BookingStatus.CANCELLED;
        booking.cancellationReason = reason;
        return bookingRepo.save(booking);
    },
    async getCustomerBookings(customerId, query) {
        const { page, limit, skip } = (0, helpers.parsePagination)(query);
        const [items, total] = await (0, data_source.getRepo)('Booking').findAndCount({
            where: { customerId }, relations: ['vehicle', 'vehicle.images', 'payment'],
            order: { createdAt: 'DESC' }, skip, take: limit,
        });
        return { items, meta: (0, helpers.buildMeta)(total, page, limit) };
    },
    async getById(bookingId, userId, role) {
        const booking = await (0, data_source.getRepo)('Booking').findOne({
            where: { id: bookingId }, relations: ['vehicle', 'vehicle.owner', 'payment', 'customer'],
        });
        if (!booking)
            throw new helpers.AppError('Booking not found', 404);
        if (role !== 'admin' && booking.vehicle.ownerId !== userId && booking.customerId !== userId) {
            throw new helpers.AppError('Access denied', 403);
        }
        return booking;
    },
    async activateCompletedBookings() {
        const today = new Date().toISOString().split('T')[0];
        const repo = (0, data_source.getRepo)('Booking');
        await repo.createQueryBuilder().update().set({ status: enums.BookingStatus.ACTIVE })
            .where("status = 'paid'").andWhere('startDate <= :today', { today }).execute();
        await repo.createQueryBuilder().update().set({ status: enums.BookingStatus.COMPLETED })
            .where("status = 'active'").andWhere('endDate < :today', { today }).execute();
    },
};

module.exports = { bookingModel: bookingModel }
