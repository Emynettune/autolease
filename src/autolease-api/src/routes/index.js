"use strict";

const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const vehicleRoutes = require("./vehicleRoutes");
const bookingRoutes = require("./bookingRoutes");
const paymentRoutes = require("./paymentRoutes");
const withdrawalRoutes = require("./withdrawalRoutes");
const reviewRoutes = require("./reviewRoutes");
const adminRoutes = require("./adminRoutes");
const router = (0, express.Router)();
router.get('/health', (_req, res) => {
    res.json({ success: true, message: 'AutoLease API is running', timestamp: new Date().toISOString() });
});
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/withdrawals', withdrawalRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);
module.exports = router;
