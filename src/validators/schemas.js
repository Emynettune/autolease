"use strict";

const zod = require("zod");
const enums = require("../types/enums");
exports.registerSchema = zod.z.object({
    firstName: zod.z.string().min(2).max(100),
    lastName: zod.z.string().min(2).max(100),
    email: zod.z.string().email(),
    password: zod.z.string().min(8).max(128),
    role: zod.z.enum([enums.UserRole.CUSTOMER, enums.UserRole.CAR_OWNER]).default(enums.UserRole.CUSTOMER),
    phone: zod.z.string().optional(),
});
exports.loginSchema = zod.z.object({
    email: zod.z.string().email(),
    password: zod.z.string().min(1),
    twoFactorCode: zod.z.string().length(6).optional(),
});
exports.googleAuthSchema = zod.z.object({
    idToken: zod.z.string().min(1),
    role: zod.z.enum([enums.UserRole.CUSTOMER, enums.UserRole.CAR_OWNER]).optional(),
});
exports.refreshTokenSchema = zod.z.object({ refreshToken: zod.z.string().min(1) });
exports.forgotPasswordSchema = zod.z.object({ email: zod.z.string().email() });
exports.resetPasswordSchema = zod.z.object({
    token: zod.z.string().min(1),
    password: zod.z.string().min(8).max(128),
});
exports.changePasswordSchema = zod.z.object({
    currentPassword: zod.z.string().min(1),
    newPassword: zod.z.string().min(8).max(128),
});
exports.verifyEmailSchema = zod.z.object({ token: zod.z.string().min(1) });
exports.updateProfileSchema = zod.z.object({
    firstName: zod.z.string().min(2).max(100).optional(),
    lastName: zod.z.string().min(2).max(100).optional(),
    phone: zod.z.string().optional(),
});
exports.paginationSchema = zod.z.object({
    page: zod.z.coerce.number().int().positive().optional(),
    limit: zod.z.coerce.number().int().positive().max(100).optional(),
    sortBy: zod.z.string().optional(),
    sortOrder: zod.z.enum(['ASC', 'DESC']).optional(),
    search: zod.z.string().optional(),
});
exports.createVehicleSchema = zod.z.object({
    brand: zod.z.string().min(1).max(100),
    model: zod.z.string().min(1).max(100),
    year: zod.z.coerce.number().int().min(1900).max(new Date().getFullYear() + 1),
    vin: zod.z.string().length(17),
    engineType: zod.z.string(),
    fuelType: zod.z.string(),
    transmission: zod.z.string(),
    dailyPrice: zod.z.coerce.number().positive(),
    description: zod.z.string().min(10),
    address: zod.z.string().min(5),
    latitude: zod.z.coerce.number().optional(),
    longitude: zod.z.coerce.number().optional(),
});
exports.updateVehicleSchema = zod.z.object({
    brand: zod.z.string().min(1).max(100).optional(),
    model: zod.z.string().min(1).max(100).optional(),
    year: zod.z.coerce.number().int().optional(),
    vin: zod.z.string().length(17).optional(),
    engineType: zod.z.string().optional(),
    fuelType: zod.z.string().optional(),
    transmission: zod.z.string().optional(),
    dailyPrice: zod.z.coerce.number().positive().optional(),
    description: zod.z.string().min(10).optional(),
    address: zod.z.string().min(5).optional(),
    latitude: zod.z.coerce.number().optional(),
    longitude: zod.z.coerce.number().optional(),
});
exports.vehicleFilterSchema = zod.z.object({
    page: zod.z.coerce.number().int().positive().optional(),
    limit: zod.z.coerce.number().int().positive().max(100).optional(),
    sortBy: zod.z.string().optional(),
    sortOrder: zod.z.enum(['ASC', 'DESC']).optional(),
    search: zod.z.string().optional(),
    brand: zod.z.string().optional(),
    minPrice: zod.z.coerce.number().optional(),
    maxPrice: zod.z.coerce.number().optional(),
    fuelType: zod.z.string().optional(),
    transmission: zod.z.string().optional(),
    minYear: zod.z.coerce.number().optional(),
    maxYear: zod.z.coerce.number().optional(),
});
exports.createBookingSchema = zod.z.object({
    vehicleId: zod.z.string().uuid(),
    startDate: zod.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: zod.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
exports.cancelBookingSchema = zod.z.object({ reason: zod.z.string().min(3).optional() });
exports.createReviewSchema = zod.z.object({
    bookingId: zod.z.string().uuid(),
    rating: zod.z.coerce.number().int().min(1).max(5),
    comment: zod.z.string().max(1000).optional(),
});
exports.updateReviewSchema = zod.z.object({
    rating: zod.z.coerce.number().int().min(1).max(5).optional(),
    comment: zod.z.string().max(1000).optional(),
});
exports.addBankAccountSchema = zod.z.object({
    bankName: zod.z.string().min(2),
    accountNumber: zod.z.string().min(10).max(20),
    bankCode: zod.z.string().min(3),
});
exports.withdrawalSchema = zod.z.object({
    bankAccountId: zod.z.string().uuid(),
    amount: zod.z.coerce.number().positive(),
});
exports.rejectWithdrawalSchema = zod.z.object({ reason: zod.z.string().min(3) });
exports.twoFactorSettingSchema = zod.z.object({ enabled: zod.z.boolean() });

module.exports = {
    registerSchema: exports.registerSchema,
    loginSchema: exports.loginSchema,
    googleAuthSchema: exports.googleAuthSchema,
    refreshTokenSchema: exports.refreshTokenSchema,
    forgotPasswordSchema: exports.forgotPasswordSchema,
    resetPasswordSchema: exports.resetPasswordSchema,
    changePasswordSchema: exports.changePasswordSchema,
    verifyEmailSchema: exports.verifyEmailSchema,
    updateProfileSchema: exports.updateProfileSchema,
    paginationSchema: exports.paginationSchema,
    createVehicleSchema: exports.createVehicleSchema,
    updateVehicleSchema: exports.updateVehicleSchema,
    vehicleFilterSchema: exports.vehicleFilterSchema,
    createBookingSchema: exports.createBookingSchema,
    cancelBookingSchema: exports.cancelBookingSchema,
    createReviewSchema: exports.createReviewSchema,
    updateReviewSchema: exports.updateReviewSchema,
    addBankAccountSchema: exports.addBankAccountSchema,
    withdrawalSchema: exports.withdrawalSchema,
    rejectWithdrawalSchema: exports.rejectWithdrawalSchema,
    twoFactorSettingSchema: exports.twoFactorSettingSchema
};
//# sourceMappingURL=schemas.js.map
