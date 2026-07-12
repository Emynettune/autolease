"use strict";

const UserRole = {
    CUSTOMER: "customer",
    CAR_OWNER: "car_owner",
    ADMIN: "admin",
};

const UserStatus = {
    ACTIVE: "active",
    SUSPENDED: "suspended",
};

const BookingStatus = {
    PENDING: "pending",
    AWAITING_PAYMENT: "awaiting_payment",
    PAID: "paid",
    ACTIVE: "active",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
};

const PaymentStatus = {
    PENDING: "pending",
    SUCCESS: "success",
    FAILED: "failed",
};

const WithdrawalStatus = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    COMPLETED: "completed",
};

const WalletTransactionType = {
    CREDIT: "credit",
    DEBIT: "debit",
    COMMISSION: "commission",
    WITHDRAWAL: "withdrawal",
    REFUND: "refund",
};

const EngineType = {
    I4: "i4",
    V6: "v6",
    V8: "v8",
    ELECTRIC: "electric",
    HYBRID: "hybrid",
};

const FuelType = {
    PETROL: "petrol",
    DIESEL: "diesel",
    ELECTRIC: "electric",
    HYBRID: "hybrid",
};

const Transmission = {
    MANUAL: "manual",
    AUTOMATIC: "automatic",
};

const VehicleStatus = {
    ACTIVE: "active",
    PAUSED: "paused",
    SUSPENDED: "suspended",
};

module.exports = {
    UserRole,
    UserStatus,
    BookingStatus,
    PaymentStatus,
    WithdrawalStatus,
    WalletTransactionType,
    EngineType,
    FuelType,
    Transmission,
    VehicleStatus,
};
