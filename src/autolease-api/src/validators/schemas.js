"use strict";

const zod = require("zod");
const enums = require("../types/enums");
const registerSchema = zod.z.object({
    firstName: zod.z.string().min(2).max(100),
    lastName: zod.z.string().min(2).max(100),
    email: zod.z.string().email(),
    password: zod.z.string().min(8).max(128),
    role: zod.z.enum([enums.UserRole.CUSTOMER, enums.UserRole.CAR_OWNER]).default(enums.UserRole.CUSTOMER),
    phone: zod.z.string().optional(),
});
const loginSchema = zod.z.object({
    email: zod.z.string().email(),
    password: zod.z.string().min(1),
    twoFactorCode: zod.z.string().length(6).optional(),
});
const googleAuthSchema = zod.z.object({
    idToken: zod.z.string().min(1),
    role: zod.z.enum([enums.UserRole.CUSTOMER, enums.UserRole.CAR_OWNER]).optional(),
});
const refreshTokenSchema = zod.z.object({ refreshToken: zod.z.string().min(1) });
const forgotPasswordSchema = zod.z.object({ email: zod.z.string().email() });
const resetPasswordSchema = zod.z.object({
    token: zod.z.string().min(1),
    password: zod.z.string().min(8).max(128),
});
const changePasswordSchema = zod.z.object({
    currentPassword: zod.z.string().min(1),
    newPassword: zod.z.string().min(8).max(128),
});
const verifyEmailSchema = zod.z.object({ token: zod.z.string().min(1) });
const updateProfileSchema = zod.z.object({
    firstName: zod.z.string().min(2).max(100).optional(),
    lastName: zod.z.string().min(2).max(100).optional(),
    phone: zod.z.string().optional(),
});
 const paginationSchema = zod.z.object({
    page: zod.z.coerce.number().int().positive().optional(),
    limit: zod.z.coerce.number().int().positive().max(100).optional(),
    sortBy: zod.z.string().optional(),
    sortOrder: zod.z.enum(['ASC', 'DESC']).optional(),
    search: zod.z.string().optional(),
});
const createVehicleSchema = zod.z.object({
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
const updateVehicleSchema = zod.z.object({
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
const vehicleFilterSchema = zod.z.object({
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
const createBookingSchema = zod.z.object({
    vehicleId: zod.z.string().uuid(),
    startDate: zod.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: zod.z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});
const cancelBookingSchema = zod.z.object({ reason: zod.z.string().min(3).optional() });
const createReviewSchema = zod.z.object({
    bookingId: zod.z.string().uuid(),
    rating: zod.z.coerce.number().int().min(1).max(5),
    comment: zod.z.string().max(1000).optional(),
});
const updateReviewSchema = zod.z.object({
    rating: zod.z.coerce.number().int().min(1).max(5).optional(),
    comment: zod.z.string().max(1000).optional(),
});
const addBankAccountSchema = zod.z.object({
    bankName: zod.z.string().min(2),
    accountNumber: zod.z.string().min(10).max(20),
    bankCode: zod.z.string().min(3),
});
const withdrawalSchema = zod.z.object({
    bankAccountId: zod.z.string().uuid(),
    amount: zod.z.coerce.number().positive(),
});
const rejectWithdrawalSchema = zod.z.object({ reason: zod.z.string().min(3) });
const twoFactorSettingSchema = zod.z.object({ enabled: zod.z.boolean() });

module.exports = {
    registerSchema: registerSchema,
    loginSchema: loginSchema,
    googleAuthSchema: googleAuthSchema,
    refreshTokenSchema: refreshTokenSchema,
    forgotPasswordSchema: forgotPasswordSchema,
    resetPasswordSchema: resetPasswordSchema,
    changePasswordSchema: changePasswordSchema,
    verifyEmailSchema: verifyEmailSchema,
    updateProfileSchema: updateProfileSchema,
    paginationSchema: paginationSchema,
    createVehicleSchema: createVehicleSchema,
    updateVehicleSchema: updateVehicleSchema,
    vehicleFilterSchema: vehicleFilterSchema,
    createBookingSchema: createBookingSchema,
    cancelBookingSchema: cancelBookingSchema,
    createReviewSchema: createReviewSchema,
    updateReviewSchema: updateReviewSchema,
    addBankAccountSchema: addBankAccountSchema,
    withdrawalSchema: withdrawalSchema,
    rejectWithdrawalSchema: rejectWithdrawalSchema,
    twoFactorSettingSchema: twoFactorSettingSchema
};
