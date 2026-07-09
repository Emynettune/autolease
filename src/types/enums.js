"use strict";


var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "customer";
    UserRole["CAR_OWNER"] = "car_owner";
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["SUSPENDED"] = "suspended";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["AWAITING_PAYMENT"] = "awaiting_payment";
    BookingStatus["PAID"] = "paid";
    BookingStatus["ACTIVE"] = "active";
    BookingStatus["COMPLETED"] = "completed";
    BookingStatus["CANCELLED"] = "cancelled";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "pending";
    PaymentStatus["SUCCESS"] = "success";
    PaymentStatus["FAILED"] = "failed";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var WithdrawalStatus;
(function (WithdrawalStatus) {
    WithdrawalStatus["PENDING"] = "pending";
    WithdrawalStatus["APPROVED"] = "approved";
    WithdrawalStatus["REJECTED"] = "rejected";
    WithdrawalStatus["COMPLETED"] = "completed";
})(WithdrawalStatus || (exports.WithdrawalStatus = WithdrawalStatus = {}));
var WalletTransactionType;
(function (WalletTransactionType) {
    WalletTransactionType["CREDIT"] = "credit";
    WalletTransactionType["DEBIT"] = "debit";
    WalletTransactionType["COMMISSION"] = "commission";
    WalletTransactionType["WITHDRAWAL"] = "withdrawal";
    WalletTransactionType["REFUND"] = "refund";
})(WalletTransactionType || (exports.WalletTransactionType = WalletTransactionType = {}));
var EngineType;
(function (EngineType) {
    EngineType["I4"] = "i4";
    EngineType["V6"] = "v6";
    EngineType["V8"] = "v8";
    EngineType["ELECTRIC"] = "electric";
    EngineType["HYBRID"] = "hybrid";
})(EngineType || (exports.EngineType = EngineType = {}));
var FuelType;
(function (FuelType) {
    FuelType["PETROL"] = "petrol";
    FuelType["DIESEL"] = "diesel";
    FuelType["ELECTRIC"] = "electric";
    FuelType["HYBRID"] = "hybrid";
})(FuelType || (exports.FuelType = FuelType = {}));
var Transmission;
(function (Transmission) {
    Transmission["MANUAL"] = "manual";
    Transmission["AUTOMATIC"] = "automatic";
})(Transmission || (exports.Transmission = Transmission = {}));
var VehicleStatus;
(function (VehicleStatus) {
    VehicleStatus["ACTIVE"] = "active";
    VehicleStatus["PAUSED"] = "paused";
    VehicleStatus["SUSPENDED"] = "suspended";
})(VehicleStatus || (exports.VehicleStatus = VehicleStatus = {}));

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
    VehicleStatus
};
//# sourceMappingURL=enums.js.map