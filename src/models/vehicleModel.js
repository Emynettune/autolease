"use strict";

const typeorm = require("typeorm");
const data_source = require("../database/data-source");
const enums = require("../types/enums");
const helpers = require("../utils/helpers");
const cloudinary = require("../utils/cloudinary");
async function getOwnedVehicle(vehicleId, ownerId, relations = []) {
    const vehicle = await (0, data_source.getRepo)('Vehicle').findOne({ where: { id: vehicleId, ownerId, deletedAt: typeorm.IsNull() }, relations });
    if (!vehicle)
        throw new helpers.AppError('Vehicle not found', 404);
    return vehicle;
}
exports.vehicleModel = {
    async create(ownerId, data) {
        const vehicleRepo = (0, data_source.getRepo)('Vehicle');
        if (await vehicleRepo.findOne({ where: { vin: data.vin, deletedAt: typeorm.IsNull() } })) {
            throw new helpers.AppError('Vehicle with this VIN already exists', 409);
        }
        return vehicleRepo.save(vehicleRepo.create({ ...data, ownerId }));
    },
    async addImages(vehicleId, ownerId, files) {
        const vehicle = await getOwnedVehicle(vehicleId, ownerId);
        const imageRepo = (0, data_source.getRepo)('VehicleImage');
        const existing = await imageRepo.count({ where: { vehicleId } });
        const images = [];
        for (let i = 0; i < files.length; i++) {
            const { url, publicId } = await (0, cloudinary.uploadImage)(files[i].buffer, 'vehicles');
            images.push(imageRepo.create({ vehicleId: vehicle.id, url, publicId, isPrimary: existing === 0 && i === 0 }));
        }
        return imageRepo.save(images);
    },
    async update(vehicleId, ownerId, data) {
        const vehicle = await getOwnedVehicle(vehicleId, ownerId);
        Object.assign(vehicle, data);
        return (0, data_source.getRepo)('Vehicle').save(vehicle);
    },
    async delete(vehicleId, ownerId) {
        const vehicle = await getOwnedVehicle(vehicleId, ownerId, ['images']);
        const active = await (0, data_source.getRepo)('Booking').createQueryBuilder('b')
            .where('b.vehicleId = :vehicleId', { vehicleId })
            .andWhere("b.status IN ('paid', 'active')").getOne();
        if (active)
            throw new helpers.AppError('Cannot delete vehicle with active bookings', 400);
        for (const img of vehicle.images || [])
            await (0, cloudinary.deleteImage)(img.publicId).catch(() => { });
        vehicle.deletedAt = new Date();
        vehicle.status = enums.VehicleStatus.PAUSED;
        vehicle.isAvailable = false;
        await (0, data_source.getRepo)('Vehicle').save(vehicle);
    },
    async setAvailability(vehicleId, ownerId, isAvailable) {
        const vehicle = await getOwnedVehicle(vehicleId, ownerId); 
        vehicle.isAvailable = isAvailable;
        return (0, data_source.getRepo)('Vehicle').save(vehicle);
    },
    async pauseRentals(vehicleId, ownerId) {
        const vehicle = await getOwnedVehicle(vehicleId, ownerId);
        vehicle.status = enums.VehicleStatus.PAUSED;
        vehicle.isAvailable = false;
        return (0, data_source.getRepo)('Vehicle').save(vehicle);
    },
    async resumeRentals(vehicleId, ownerId) {
        const vehicle = await getOwnedVehicle(vehicleId, ownerId);
        if (vehicle.status === enums.VehicleStatus.SUSPENDED)
            throw new helpers.AppError('Vehicle is suspended by admin', 403);
        vehicle.status = enums.VehicleStatus.ACTIVE;
        vehicle.isAvailable = true;
        return (0, data_source.getRepo)('Vehicle').save(vehicle);
    },
    async getOwnerBookings(ownerId, query) {
        const { page, limit, skip } = (0, helpers.parsePagination)(query);
        const [items, total] = await (0, data_source.getRepo)('Booking').createQueryBuilder('booking')
            .innerJoinAndSelect('booking.vehicle', 'vehicle')
            .innerJoinAndSelect('booking.customer', 'customer')
            .leftJoinAndSelect('booking.payment', 'payment')
            .where('vehicle.ownerId = :ownerId', { ownerId })
            .orderBy('booking.createdAt', 'DESC').skip(skip).take(limit).getManyAndCount();
        return { items, meta: (0, helpers.buildMeta)(total, page, limit) };
    },
    async getOwnerEarnings(ownerId) {
        const wallet = await (0, data_source.getRepo)('Wallet').findOne({ where: { userId: ownerId } });
        const completedRentals = await (0, data_source.getRepo)('Booking').createQueryBuilder('b')
            .innerJoin('b.vehicle', 'v').where('v.ownerId = :ownerId', { ownerId })
            .andWhere("b.status = 'completed'").getCount();
        return { availableBalance: wallet?.availableBalance || 0, pendingBalance: wallet?.pendingBalance || 0, completedRentals };
    },
    async browse(query) {
        const { page, limit, skip, sortBy, sortOrder, search } = (0, helpers.parsePagination)(query);
        const qb = (0, data_source.getRepo)('Vehicle').createQueryBuilder('v')
            .leftJoinAndSelect('v.images', 'images')
            .leftJoinAndSelect('v.owner', 'owner')
            .where('v.status = :status', { status: enums.VehicleStatus.ACTIVE })
            .andWhere('v.deletedAt IS NULL')
            .andWhere('v.isAvailable = true');
        if (search) {
            qb.andWhere(new typeorm.Brackets((sub) => {
                sub.where('v.brand ILIKE :search', { search: `%${search}%` })
                    .orWhere('v.model ILIKE :search', { search: `%${search}%` })
                    .orWhere('v.description ILIKE :search', { search: `%${search}%` });
            }));
        }
        if (query.brand)
            qb.andWhere('v.brand ILIKE :brand', { brand: `%${query.brand}%` });
        if (query.fuelType)
            qb.andWhere('v.fuelType = :fuelType', { fuelType: query.fuelType });
        if (query.transmission)
            qb.andWhere('v.transmission = :transmission', { transmission: query.transmission });
        if (query.minPrice)
            qb.andWhere('v.dailyPrice >= :minPrice', { minPrice: query.minPrice });
        if (query.maxPrice)
            qb.andWhere('v.dailyPrice <= :maxPrice', { maxPrice: query.maxPrice });
        if (query.minYear)
            qb.andWhere('v.year >= :minYear', { minYear: query.minYear });
        if (query.maxYear)
            qb.andWhere('v.year <= :maxYear', { maxYear: query.maxYear });
        const allowed = ['dailyPrice', 'year', 'averageRating', 'createdAt'];
        qb.orderBy(`v.${allowed.includes(sortBy) ? sortBy : 'createdAt'}`, sortOrder);
        const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();
        return { items, meta: (0, helpers.buildMeta)(total, page, limit) };
    },
    async getById(id) {
        const vehicle = await (0, data_source.getRepo)('Vehicle').findOne({ where: { id, deletedAt: typeorm.IsNull() }, relations: ['images', 'owner', 'reviews'] });
        if (!vehicle)
            throw new helpers.AppError('Vehicle not found', 404);
        return vehicle;
    },
    async getOwnerVehicles(ownerId, query) {
        const { page, limit, skip } = (0, helpers.parsePagination)(query);
        const [items, total] = await (0, data_source.getRepo)('Vehicle').findAndCount({
            where: { ownerId, deletedAt: typeorm.IsNull() }, relations: ['images'], order: { createdAt: 'DESC' }, skip, take: limit,
        });
        return { items, meta: (0, helpers.buildMeta)(total, page, limit) };
    },
};

module.exports = { vehicleModel: exports.vehicleModel };
//# sourceMappingURL=vehicleModel.js.map
