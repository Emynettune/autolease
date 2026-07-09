"use strict";

const data_source = require("../database/data-source");
const typeorm = require("typeorm");
const enums = require("../types/enums");
const helpers = require("../utils/helpers");
exports.reviewModel = {
    async create(customerId, bookingId, rating, comment) {
        const booking = await (0, data_source.getRepo)('Booking').findOne({ where: { id: bookingId, customerId } });
        if (!booking)
            throw new helpers.AppError('Booking not found', 404);
        if (booking.status !== enums.BookingStatus.COMPLETED)
            throw new helpers.AppError('Can only review completed bookings', 400);
        if (await (0, data_source.getRepo)('Review').findOne({ where: { bookingId, deletedAt: typeorm.IsNull() } })) {
            throw new helpers.AppError('Review already exists for this booking', 409);
        }
        const reviewRepo = (0, data_source.getRepo)('Review');
        const saved = await reviewRepo.save(reviewRepo.create({
            customerId, vehicleId: booking.vehicleId, bookingId, rating, comment,
        }));
        await updateVehicleRating(booking.vehicleId);
        return saved;
    },
    async update(reviewId, customerId, data) {
        const reviewRepo = (0, data_source.getRepo)('Review');
        const review = await reviewRepo.findOne({ where: { id: reviewId, customerId, deletedAt: typeorm.IsNull() } });
        if (!review)
            throw new helpers.AppError('Review not found', 404);
        Object.assign(review, data);
        const saved = await reviewRepo.save(review);
        await updateVehicleRating(review.vehicleId);
        return saved;
    },
    async delete(reviewId, customerId) {
        const reviewRepo = (0, data_source.getRepo)('Review');
        const review = await reviewRepo.findOne({ where: { id: reviewId, customerId, deletedAt: typeorm.IsNull() } });
        if (!review)
            throw new helpers.AppError('Review not found', 404);
        const vehicleId = review.vehicleId;
        review.deletedAt = new Date();
        await reviewRepo.save(review);
        await updateVehicleRating(vehicleId);
    },
    async getVehicleReviews(vehicleId, query) {
        const { page, limit, skip } = (0, helpers.parsePagination)(query);
        const [items, total] = await (0, data_source.getRepo)('Review').findAndCount({
            where: { vehicleId, deletedAt: typeorm.IsNull() }, relations: ['customer'], order: { createdAt: 'DESC' }, skip, take: limit,
        });
        return { items, meta: (0, helpers.buildMeta)(total, page, limit) };
    },
};
async function updateVehicleRating(vehicleId) {
    const result = await (0, data_source.getRepo)('Review').createQueryBuilder('r')
        .select('AVG(r.rating)', 'avg').addSelect('COUNT(r.id)', 'count')
        .where('r.vehicleId = :vehicleId', { vehicleId })
        .andWhere('r.deletedAt IS NULL')
        .getRawOne();
    await (0, data_source.getRepo)('Vehicle').update(vehicleId, {
        averageRating: Number(parseFloat(result.avg || '0').toFixed(2)),
        totalReviews: parseInt(result.count || '0', 10),
    });
}

module.exports = { reviewModel: exports.reviewModel };
//# sourceMappingURL=reviewModel.js.map
