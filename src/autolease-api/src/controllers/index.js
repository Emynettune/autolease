"use strict";

const authModel = require("../models/authModel");
const userModel = require("../models/userModel");
const vehicleModel = require("../models/vehicleModel");
const bookingModel = require("../models/bookingModel");
const paymentModel = require("../models/paymentModel");
const withdrawalModel = require("../models/withdrawalModel");
const reviewModel = require("../models/reviewModel");
const adminModel = require("../models/adminModel");
const helpers = require("../utils/helpers");
const wrap = (fn) => fn;
module.exports = {
    auth: {
        register: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Registration successful', await authModel.authModel.register(req.body), 201);
            }
            catch (e) {
                next(e);
            }
        }),
        login: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Login successful', await authModel.authModel.login(req.body.email, req.body.password, req.body.twoFactorCode, { userAgent: req.get('user-agent'), ipAddress: req.ip }));
            }
            catch (e) {
                next(e);
            }
        }),
        googleLogin: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Google login successful', await authModel.authModel.googleLogin(req.body.idToken, req.body.role));
            }
            catch (e) {
                next(e);
            }
        }),
        refresh: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Token refreshed', await authModel.authModel.refresh(req.body.refreshToken));
            }
            catch (e) {
                next(e);
            }
        }),
        logout: wrap(async (req, res, next) => {
            try {
                await authModel.authModel.logout(req.body.refreshToken);
                (0, helpers.sendSuccess)(res, 'Logged out successfully', undefined);
            }
            catch (e) {
                next(e);
            }
        }),
        verifyEmail: wrap(async (req, res, next) => {
            try {
                const token = req.query.token || req.body.token;
                (0, helpers.sendSuccess)(res, 'Email verified', await authModel.authModel.verifyEmail(token));
            }
            catch (e) {
                next(e);
            }
        }),
        forgotPassword: wrap(async (req, res, next) => {
            try {
                await authModel.authModel.forgotPassword(req.body.email);
                (0, helpers.sendSuccess)(res, 'If the email exists, a reset link has been sent', undefined);
            }
            catch (e) {
                next(e);
            }
        }),
        resetPassword: wrap(async (req, res, next) => {
            try {
                await authModel.authModel.resetPassword(req.body.token, req.body.password);
                (0, helpers.sendSuccess)(res, 'Password reset successful', undefined);
            }
            catch (e) {
                next(e);
            }
        }),
        changePassword: wrap(async (req, res, next) => {
            try {
                await authModel.authModel.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
                (0, helpers.sendSuccess)(res, 'Password changed', undefined);
            }
            catch (e) {
                next(e);
            }
        }),
        setTwoFactor: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Two-factor setting updated', await authModel.authModel.setTwoFactor(req.user.id, req.body.enabled));
            }
            catch (e) {
                next(e);
            }
        }),
    },
    user: {
        getProfile: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Profile retrieved', await userModel.userModel.getProfile(req.user.id));
            }
            catch (e) {
                next(e);
            }
        }),
        updateProfile: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Profile updated', await userModel.userModel.updateProfile(req.user.id, req.body));
            }
            catch (e) {
                next(e);
            }
        }),
        uploadPicture: wrap(async (req, res, next) => {
            try {
                if (!req.file)
                    throw new helpers.AppError('No file uploaded', 400);
                (0, helpers.sendSuccess)(res, 'Picture uploaded', await userModel.userModel.uploadProfilePicture(req.user.id, req.file.buffer));
            }
            catch (e) {
                next(e);
            }
        }),
        getWallet: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Wallet retrieved', await userModel.userModel.getWallet(req.user.id));
            }
            catch (e) {
                next(e);
            }
        }),
        getWalletTx: wrap(async (req, res, next) => {
            try {
                const r = await userModel.userModel.getWalletTransactions(req.user.id, req.query);
                (0, helpers.sendSuccess)(res, 'Transactions retrieved', r.items, 200, r.meta);
            }
            catch (e) {
                next(e);
            }
        }),
        getRentals: wrap(async (req, res, next) => {
            try {
                const r = await userModel.userModel.getRentalHistory(req.user.id, req.query);
                (0, helpers.sendSuccess)(res, 'Rental history', r.items, 200, r.meta);
            }
            catch (e) {
                next(e);
            }
        }),
        getPayments: wrap(async (req, res, next) => {
            try {
                const r = await userModel.userModel.getPaymentHistory(req.user.id, req.query);
                (0, helpers.sendSuccess)(res, 'Payment history', r.items, 200, r.meta);
            }
            catch (e) {
                next(e);
            }
        }),
        getSessions: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Sessions retrieved', await userModel.userModel.getDeviceSessions(req.user.id));
            }
            catch (e) {
                next(e);
            }
        }),
        revokeSession: wrap(async (req, res, next) => {
            try {
                await userModel.userModel.revokeDeviceSession(req.user.id, (0, helpers.getParam)(req, 'id'));
                (0, helpers.sendSuccess)(res, 'Session revoked', undefined);
            }
            catch (e) {
                next(e);
            }
        }),
    },
    vehicle: {
        browse: wrap(async (req, res, next) => {
            try {
                const r = await vehicleModel.vehicleModel.browse(req.query);
                (0, helpers.sendSuccess)(res, 'Vehicles retrieved', r.items, 200, r.meta);
            }
            catch (e) {
                next(e);
            }
        }),
        getById: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Vehicle retrieved', await vehicleModel.vehicleModel.getById((0, helpers.getParam)(req, 'id')));
            }
            catch (e) {
                next(e);
            }
        }),
        create: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Vehicle registered', await vehicleModel.vehicleModel.create(req.user.id, req.body), 201);
            }
            catch (e) {
                next(e);
            }
        }),
        uploadImages: wrap(async (req, res, next) => {
            try {
                const files = req.files;
                if (!files?.length)
                    throw new helpers.AppError('No files uploaded', 400);
                (0, helpers.sendSuccess)(res, 'Images uploaded', await vehicleModel.vehicleModel.addImages((0, helpers.getParam)(req, 'id'), req.user.id, files));
            }
            catch (e) {
                next(e);
            }
        }),
        update: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Vehicle updated', await vehicleModel.vehicleModel.update((0, helpers.getParam)(req, 'id'), req.user.id, req.body));
            }
            catch (e) {
                next(e);
            }
        }),
        delete: wrap(async (req, res, next) => {
            try {
                await vehicleModel.vehicleModel.delete((0, helpers.getParam)(req, 'id'), req.user.id);
                (0, helpers.sendSuccess)(res, 'Vehicle deleted', undefined);
            }
            catch (e) {
                next(e);
            }
        }),
        setAvailability: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Availability updated', await vehicleModel.vehicleModel.setAvailability((0, helpers.getParam)(req, 'id'), req.user.id, req.body.isAvailable));
            }
            catch (e) {
                next(e);
            }
        }),
        pause: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Rentals paused', await vehicleModel.vehicleModel.pauseRentals((0, helpers.getParam)(req, 'id'), req.user.id));
            }
            catch (e) {
                next(e);
            }
        }),
        resume: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Rentals resumed', await vehicleModel.vehicleModel.resumeRentals((0, helpers.getParam)(req, 'id'), req.user.id));
            }
            catch (e) {
                next(e);
            }
        }),
        getMine: wrap(async (req, res, next) => {
            try {
                const r = await vehicleModel.vehicleModel.getOwnerVehicles(req.user.id, req.query);
                (0, helpers.sendSuccess)(res, 'Your vehicles', r.items, 200, r.meta);
            }
            catch (e) {
                next(e);
            }
        }),
        getBookings: wrap(async (req, res, next) => {
            try {
                const r = await vehicleModel.vehicleModel.getOwnerBookings(req.user.id, req.query);
                (0, helpers.sendSuccess)(res, 'Bookings retrieved', r.items, 200, r.meta);
            }
            catch (e) {
                next(e);
            }
        }),
        getEarnings: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Earnings retrieved', await vehicleModel.vehicleModel.getOwnerEarnings(req.user.id));
            }
            catch (e) {
                next(e);
            }
        }),
    },
    booking: {
        create: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Booking created', await bookingModel.bookingModel.create(req.user.id, req.body.vehicleId, req.body.startDate, req.body.endDate), 201);
            }
            catch (e) {
                next(e);
            }
        }),
        cancel: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Booking cancelled', await bookingModel.bookingModel.cancel((0, helpers.getParam)(req, 'id'), req.user.id, req.body.reason));
            }
            catch (e) {
                next(e);
            }
        }),
        getMine: wrap(async (req, res, next) => {
            try {
                const r = await bookingModel.bookingModel.getCustomerBookings(req.user.id, req.query);
                (0, helpers.sendSuccess)(res, 'Bookings retrieved', r.items, 200, r.meta);
            }
            catch (e) {
                next(e);
            }
        }),
        getById: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Booking retrieved', await bookingModel.bookingModel.getById((0, helpers.getParam)(req, 'id'), req.user.id, req.user.role));
            }
            catch (e) {
                next(e);
            }
        }),
    },
    payment: {
        initialize: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Payment initialized', await paymentModel.paymentModel.initialize((0, helpers.getParam)(req, 'bookingId'), req.user.id));
            }
            catch (e) {
                next(e);
            }
        }),
        verify: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Payment verified', await paymentModel.paymentModel.verify(req.query.reference));
            }
            catch (e) {
                next(e);
            }
        }),
        callback: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Payment callback processed', await paymentModel.paymentModel.verify(req.query.reference));
            }
            catch (e) {
                next(e);
            }
        }),
        webhook: wrap(async (req, res, next) => {
            try {
                const payload = Buffer.isBuffer(req.body) ? req.body.toString() : JSON.stringify(req.body);
                const signature = req.headers['x-paystack-signature'];
                (0, helpers.sendSuccess)(res, 'Webhook processed', await paymentModel.paymentModel.handleWebhook(payload, signature ?? ''));
            }
            catch (e) {
                next(e);
            }
        }),
    },
    withdrawal: {
        addBank: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Bank account added', await withdrawalModel.withdrawalModel.addBankAccount(req.user.id, req.body), 201);
            }
            catch (e) {
                next(e);
            }
        }),
        getBanks: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Bank accounts', await withdrawalModel.withdrawalModel.getBankAccounts(req.user.id));
            }
            catch (e) {
                next(e);
            }
        }),
        request: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Withdrawal requested', await withdrawalModel.withdrawalModel.requestWithdrawal(req.user.id, req.body.bankAccountId, req.body.amount), 201);
            }
            catch (e) {
                next(e);
            }
        }),
        history: wrap(async (req, res, next) => {
            try {
                const r = await withdrawalModel.withdrawalModel.getWithdrawalHistory(req.user.id, req.query);
                (0, helpers.sendSuccess)(res, 'Withdrawal history', r.items, 200, r.meta);
            }
            catch (e) {
                next(e);
            }
        }),
    },
    review: {
        create: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Review created', await reviewModel.reviewModel.create(req.user.id, req.body.bookingId, req.body.rating, req.body.comment), 201);
            }
            catch (e) {
                next(e);
            }
        }),
        update: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Review updated', await reviewModel.reviewModel.update((0, helpers.getParam)(req, 'id'), req.user.id, req.body));
            }
            catch (e) {
                next(e);
            }
        }),
        delete: wrap(async (req, res, next) => {
            try {
                await reviewModel.reviewModel.delete((0, helpers.getParam)(req, 'id'), req.user.id);
                (0, helpers.sendSuccess)(res, 'Review deleted', undefined);
            }
            catch (e) {
                next(e);
            }
        }),
        getVehicle: wrap(async (req, res, next) => {
            try {
                const r = await reviewModel.reviewModel.getVehicleReviews((0, helpers.getParam)(req, 'vehicleId'), req.query);
                (0, helpers.sendSuccess)(res, 'Reviews retrieved', r.items, 200, r.meta);
            }
            catch (e) {
                next(e);
            }
        }),
    },
    admin: {
        analytics: wrap(async (_req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Analytics', await adminModel.adminModel.getAnalytics());
            }
            catch (e) {
                next(e);
            }
        }),
        getUsers: wrap(async (req, res, next) => {
            try {
                const r = await adminModel.adminModel.getAllUsers(req.query);
                (0, helpers.sendSuccess)(res, 'Users', r.items, 200, r.meta);
            }
            catch (e) {
                next(e);
            }
        }),
        suspendUser: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'User suspended', await adminModel.adminModel.suspendUser((0, helpers.getParam)(req, 'id')));
            }
            catch (e) {
                next(e);
            }
        }),
        activateUser: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'User activated', await adminModel.adminModel.activateUser((0, helpers.getParam)(req, 'id')));
            }
            catch (e) {
                next(e);
            }
        }),
        suspendVehicle: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Vehicle suspended', await adminModel.adminModel.suspendVehicle((0, helpers.getParam)(req, 'id')));
            }
            catch (e) {
                next(e);
            }
        }),
        verifyOwner: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Owner verified', await adminModel.adminModel.verifyOwner((0, helpers.getParam)(req, 'id')));
            }
            catch (e) {
                next(e);
            }
        }),
        getPayments: wrap(async (req, res, next) => {
            try {
                const r = await adminModel.adminModel.getAllPayments(req.query);
                (0, helpers.sendSuccess)(res, 'Payments', r.items, 200, r.meta);
            }
            catch (e) {
                next(e);
            }
        }),
        getFailedPayments: wrap(async (req, res, next) => {
            try {
                const r = await adminModel.adminModel.getFailedPayments(req.query);
                (0, helpers.sendSuccess)(res, 'Failed payments', r.items, 200, r.meta);
            }
            catch (e) {
                next(e);
            }
        }),
        getAuditLogs: wrap(async (req, res, next) => {
            try {
                const r = await adminModel.adminModel.getAuditLogs(req.query);
                (0, helpers.sendSuccess)(res, 'Audit logs', r.items, 200, r.meta);
            }
            catch (e) {
                next(e);
            }
        }),
        pendingWithdrawals: wrap(async (req, res, next) => {
            try {
                const r = await withdrawalModel.withdrawalModel.getAllPending(req.query);
                (0, helpers.sendSuccess)(res, 'Pending withdrawals', r.items, 200, r.meta);
            }
            catch (e) {
                next(e);
            }
        }),
        approveWithdrawal: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Withdrawal approved', await withdrawalModel.withdrawalModel.approve((0, helpers.getParam)(req, 'id'), req.user.id));
            }
            catch (e) {
                next(e);
            }
        }),
        rejectWithdrawal: wrap(async (req, res, next) => {
            try {
                (0, helpers.sendSuccess)(res, 'Withdrawal rejected', await withdrawalModel.withdrawalModel.reject((0, helpers.getParam)(req, 'id'), req.user.id, req.body.reason));
            }
            catch (e) {
                next(e);
            }
        }),
    },
};


