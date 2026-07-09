"use strict";

const typeorm = require("typeorm");
const enums = require("../types/enums");
const uuidCol = { type: 'uuid', primary: true, generated: 'uuid' };
const timestamps = {
    createdAt: { type: 'timestamp', createDate: true },
    updatedAt: { type: 'timestamp', updateDate: true },
};
const softDelete = { deletedAt: { type: 'timestamp', nullable: true, deleteDate: true } };
function defineEntity(options) {
    return new typeorm.EntitySchema(options);
}
exports.User = defineEntity({
    name: 'User',
    tableName: 'users',
    columns: {
        id: uuidCol,
        firstName: { type: 'varchar', length: 100 },
        lastName: { type: 'varchar', length: 100 },
        email: { type: 'varchar', length: 255, unique: true },
        password: { type: 'varchar', nullable: true },
        googleId: { type: 'varchar', nullable: true },
        profilePicture: { type: 'varchar', nullable: true },
        phone: { type: 'varchar', length: 20, nullable: true },
        role: { type: 'enum', enum: Object.values(enums.UserRole), default: enums.UserRole.CUSTOMER },
        status: { type: 'enum', enum: Object.values(enums.UserStatus), default: enums.UserStatus.ACTIVE },
        isEmailVerified: { type: 'boolean', default: false },
        isOwnerVerified: { type: 'boolean', default: false },
        twoFactorEnabled: { type: 'boolean', default: false },
        twoFactorCode: { type: 'varchar', nullable: true },
        twoFactorExpires: { type: 'timestamp', nullable: true },
        emailVerificationToken: { type: 'varchar', nullable: true },
        passwordResetToken: { type: 'varchar', nullable: true },
        passwordResetExpires: { type: 'timestamp', nullable: true },
        ...timestamps,
        ...softDelete,
    },
    indices: [
        { name: 'idx_users_email', columns: ['email'] },
        { name: 'idx_users_role_status', columns: ['role', 'status'] },
    ],
    relations: {
        wallet: { type: 'one-to-one', target: 'Wallet', inverseSide: 'user' },
        vehicles: { type: 'one-to-many', target: 'Vehicle', inverseSide: 'owner' },
        bookings: { type: 'one-to-many', target: 'Booking', inverseSide: 'customer' },
        reviews: { type: 'one-to-many', target: 'Review', inverseSide: 'customer' },
        bankAccounts: { type: 'one-to-many', target: 'BankAccount', inverseSide: 'user' },
        withdrawals: { type: 'one-to-many', target: 'Withdrawal', inverseSide: 'user' },
        refreshTokens: { type: 'one-to-many', target: 'RefreshToken', inverseSide: 'user' },
    },
});
exports.RefreshToken = defineEntity({
    name: 'RefreshToken',
    tableName: 'refresh_tokens',
    columns: {
        id: uuidCol,
        userId: { type: 'uuid' },
        token: { type: 'varchar', unique: true },
        expiresAt: { type: 'timestamp' },
        isRevoked: { type: 'boolean', default: false },
        createdAt: timestamps.createdAt,
    },
    indices: [
        { name: 'idx_refresh_tokens_user_revoked', columns: ['userId', 'isRevoked'] },
        { name: 'idx_refresh_tokens_expires', columns: ['expiresAt'] },
    ],
    relations: {
        user: { type: 'many-to-one', target: 'User', joinColumn: { name: 'userId' }, onDelete: 'CASCADE' },
    },
});
exports.BlacklistedToken = defineEntity({
    name: 'BlacklistedToken',
    tableName: 'blacklisted_tokens',
    columns: {
        id: uuidCol,
        tokenId: { type: 'varchar', unique: true },
        userId: { type: 'uuid', nullable: true },
        expiresAt: { type: 'timestamp' },
        createdAt: timestamps.createdAt,
    },
    indices: [{ name: 'idx_blacklisted_tokens_expires', columns: ['expiresAt'] }],
});
exports.DeviceSession = defineEntity({
    name: 'DeviceSession',
    tableName: 'device_sessions',
    columns: {
        id: uuidCol,
        userId: { type: 'uuid' },
        refreshTokenId: { type: 'uuid', nullable: true },
        userAgent: { type: 'varchar', nullable: true },
        ipAddress: { type: 'varchar', nullable: true },
        lastSeenAt: { type: 'timestamp', nullable: true },
        revokedAt: { type: 'timestamp', nullable: true },
        ...timestamps,
    },
    indices: [
        { name: 'idx_device_sessions_user_revoked', columns: ['userId', 'revokedAt'] },
        { name: 'idx_device_sessions_refresh_token', columns: ['refreshTokenId'] },
    ],
    relations: {
        user: { type: 'many-to-one', target: 'User', joinColumn: { name: 'userId' }, onDelete: 'CASCADE' },
    },
});
exports.Wallet = defineEntity({
    name: 'Wallet',
    tableName: 'wallets',
    columns: {
        id: uuidCol,
        userId: { type: 'uuid', unique: true },
        availableBalance: { type: 'decimal', precision: 12, scale: 2, default: 0 },
        pendingBalance: { type: 'decimal', precision: 12, scale: 2, default: 0 },
        ...timestamps,
    },
    relations: {
        user: { type: 'one-to-one', target: 'User', joinColumn: { name: 'userId' }, onDelete: 'CASCADE' },
        transactions: { type: 'one-to-many', target: 'WalletTransaction', inverseSide: 'wallet' },
    },
});
exports.WalletTransaction = defineEntity({
    name: 'WalletTransaction',
    tableName: 'wallet_transactions',
    columns: {
        id: uuidCol,
        walletId: { type: 'uuid' },
        type: { type: 'enum', enum: Object.values(enums.WalletTransactionType) },
        amount: { type: 'decimal', precision: 12, scale: 2 },
        balanceAfter: { type: 'decimal', precision: 12, scale: 2 },
        description: { type: 'text', nullable: true },
        reference: { type: 'varchar', nullable: true },
        createdAt: timestamps.createdAt,
    },
    relations: {
        wallet: { type: 'many-to-one', target: 'Wallet', joinColumn: { name: 'walletId' }, onDelete: 'CASCADE' },
    },
});
exports.Vehicle = defineEntity({
    name: 'Vehicle',
    tableName: 'vehicles',
    columns: {
        id: uuidCol,
        ownerId: { type: 'uuid' },
        brand: { type: 'varchar', length: 100 },
        model: { type: 'varchar', length: 100 },
        year: { type: 'int' },
        vin: { type: 'varchar', length: 17, unique: true },
        engineType: { type: 'enum', enum: Object.values(enums.EngineType) },
        fuelType: { type: 'enum', enum: Object.values(enums.FuelType) },
        transmission: { type: 'enum', enum: Object.values(enums.Transmission) },
        dailyPrice: { type: 'decimal', precision: 10, scale: 2 },
        description: { type: 'text' },
        address: { type: 'varchar', length: 255 },
        latitude: { type: 'decimal', precision: 10, scale: 7, nullable: true },
        longitude: { type: 'decimal', precision: 10, scale: 7, nullable: true },
        status: { type: 'enum', enum: Object.values(enums.VehicleStatus), default: enums.VehicleStatus.ACTIVE },
        isAvailable: { type: 'boolean', default: true },
        averageRating: { type: 'decimal', precision: 3, scale: 2, default: 0 },
        totalReviews: { type: 'int', default: 0 },
        ...timestamps,
        ...softDelete,
    },
    indices: [
        { name: 'idx_vehicles_owner', columns: ['ownerId'] },
        { name: 'idx_vehicles_status_available', columns: ['status', 'isAvailable'] },
        { name: 'idx_vehicles_price_year', columns: ['dailyPrice', 'year'] },
    ],
    relations: {
        owner: { type: 'many-to-one', target: 'User', joinColumn: { name: 'ownerId' }, onDelete: 'CASCADE' },
        images: { type: 'one-to-many', target: 'VehicleImage', inverseSide: 'vehicle' },
        bookings: { type: 'one-to-many', target: 'Booking', inverseSide: 'vehicle' },
        reviews: { type: 'one-to-many', target: 'Review', inverseSide: 'vehicle' },
    },
});
exports.VehicleImage = defineEntity({
    name: 'VehicleImage',
    tableName: 'vehicle_images',
    columns: {
        id: uuidCol,
        vehicleId: { type: 'uuid' },
        url: { type: 'varchar' },
        publicId: { type: 'varchar' },
        isPrimary: { type: 'boolean', default: false },
        createdAt: timestamps.createdAt,
    },
    relations: {
        vehicle: { type: 'many-to-one', target: 'Vehicle', joinColumn: { name: 'vehicleId' }, onDelete: 'CASCADE' },
    },
});
exports.Booking = defineEntity({
    name: 'Booking',
    tableName: 'bookings',
    columns: {
        id: uuidCol,
        customerId: { type: 'uuid' },
        vehicleId: { type: 'uuid' },
        startDate: { type: 'date' },
        endDate: { type: 'date' },
        totalDays: { type: 'int' },
        dailyRate: { type: 'decimal', precision: 12, scale: 2 },
        totalAmount: { type: 'decimal', precision: 12, scale: 2 },
        status: { type: 'enum', enum: Object.values(enums.BookingStatus), default: enums.BookingStatus.PENDING },
        cancellationReason: { type: 'text', nullable: true },
        ...timestamps,
        ...softDelete,
    },
    indices: [
        { name: 'idx_bookings_customer_status', columns: ['customerId', 'status'] },
        { name: 'idx_bookings_vehicle_status', columns: ['vehicleId', 'status'] },
        { name: 'idx_bookings_dates', columns: ['startDate', 'endDate'] },
    ],
    relations: {
        customer: { type: 'many-to-one', target: 'User', joinColumn: { name: 'customerId' } },
        vehicle: { type: 'many-to-one', target: 'Vehicle', joinColumn: { name: 'vehicleId' } },
        payment: { type: 'one-to-one', target: 'Payment', inverseSide: 'booking' },
        review: { type: 'one-to-one', target: 'Review', inverseSide: 'booking' },
    },
});
exports.Payment = defineEntity({
    name: 'Payment',
    tableName: 'payments',
    columns: {
        id: uuidCol,
        bookingId: { type: 'uuid', unique: true },
        amount: { type: 'decimal', precision: 12, scale: 2 },
        status: { type: 'enum', enum: Object.values(enums.PaymentStatus), default: enums.PaymentStatus.PENDING },
        paystackReference: { type: 'varchar', nullable: true },
        paystackTransactionId: { type: 'varchar', nullable: true },
        metadata: { type: 'jsonb', nullable: true },
        failureReason: { type: 'text', nullable: true },
        ...timestamps,
        ...softDelete,
    },
    indices: [
        { name: 'idx_payments_reference', columns: ['paystackReference'] },
        { name: 'idx_payments_status_created', columns: ['status', 'createdAt'] },
    ],
    relations: {
        booking: { type: 'one-to-one', target: 'Booking', joinColumn: { name: 'bookingId' }, onDelete: 'CASCADE' },
    },
});
exports.BankAccount = defineEntity({
    name: 'BankAccount',
    tableName: 'bank_accounts',
    columns: {
        id: uuidCol,
        userId: { type: 'uuid' },
        bankName: { type: 'varchar', length: 100 },
        accountNumber: { type: 'varchar', length: 20 },
        accountName: { type: 'varchar', length: 100 },
        bankCode: { type: 'varchar', length: 20, nullable: true },
        isVerified: { type: 'boolean', default: false },
        isDefault: { type: 'boolean', default: false },
        ...timestamps,
    },
    relations: {
        user: { type: 'many-to-one', target: 'User', joinColumn: { name: 'userId' }, onDelete: 'CASCADE' },
    },
});
exports.Withdrawal = defineEntity({
    name: 'Withdrawal',
    tableName: 'withdrawals',
    columns: {
        id: uuidCol,
        userId: { type: 'uuid' },
        bankAccountId: { type: 'uuid' },
        amount: { type: 'decimal', precision: 12, scale: 2 },
        status: { type: 'enum', enum: Object.values(enums.WithdrawalStatus), default: enums.WithdrawalStatus.PENDING },
        rejectionReason: { type: 'text', nullable: true },
        processedBy: { type: 'uuid', nullable: true },
        ...timestamps,
        ...softDelete,
    },
    indices: [
        { name: 'idx_withdrawals_user_status', columns: ['userId', 'status'] },
        { name: 'idx_withdrawals_status_created', columns: ['status', 'createdAt'] },
    ],
    relations: {
        user: { type: 'many-to-one', target: 'User', joinColumn: { name: 'userId' } },
        bankAccount: { type: 'many-to-one', target: 'BankAccount', joinColumn: { name: 'bankAccountId' } },
    },
});
exports.Review = defineEntity({
    name: 'Review',
    tableName: 'reviews',
    columns: {
        id: uuidCol,
        customerId: { type: 'uuid' },
        vehicleId: { type: 'uuid' },
        bookingId: { type: 'uuid', unique: true },
        rating: { type: 'int' },
        comment: { type: 'text', nullable: true },
        ...timestamps,
        ...softDelete,
    },
    indices: [
        { name: 'idx_reviews_vehicle_created', columns: ['vehicleId', 'createdAt'] },
        { name: 'idx_reviews_customer', columns: ['customerId'] },
    ],
    relations: {
        customer: { type: 'many-to-one', target: 'User', joinColumn: { name: 'customerId' } },
        vehicle: { type: 'many-to-one', target: 'Vehicle', joinColumn: { name: 'vehicleId' } },
        booking: { type: 'one-to-one', target: 'Booking', joinColumn: { name: 'bookingId' } },
    },
});
exports.AuditLog = defineEntity({
    name: 'AuditLog',
    tableName: 'audit_logs',
    columns: {
        id: uuidCol,
        userId: { type: 'uuid', nullable: true },
        action: { type: 'varchar', length: 100 },
        entity: { type: 'varchar', length: 100, nullable: true },
        entityId: { type: 'uuid', nullable: true },
        metadata: { type: 'jsonb', nullable: true },
        ipAddress: { type: 'varchar', nullable: true },
        createdAt: timestamps.createdAt,
    },
    indices: [
        { name: 'idx_audit_logs_user_created', columns: ['userId', 'createdAt'] },
        { name: 'idx_audit_logs_action_created', columns: ['action', 'createdAt'] },
    ],
});

module.exports = {
    User: exports.User,
    RefreshToken: exports.RefreshToken,
    BlacklistedToken: exports.BlacklistedToken,
    DeviceSession: exports.DeviceSession,
    Wallet: exports.Wallet,
    WalletTransaction: exports.WalletTransaction,
    Vehicle: exports.Vehicle,
    VehicleImage: exports.VehicleImage,
    Booking: exports.Booking,
    Payment: exports.Payment,
    BankAccount: exports.BankAccount,
    Withdrawal: exports.Withdrawal,
    Review: exports.Review,
    AuditLog: exports.AuditLog,
};
//# sourceMappingURL=schemas.js.map
