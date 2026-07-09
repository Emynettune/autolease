"use strict";

const express = require("express");
const authRoutes = __importDefault(require("./authRoutes"));
const userRoutes = __importDefault(require("./userRoutes"));
const vehicleRoutes = __importDefault(require("./vehicleRoutes"));
const bookingRoutes = __importDefault(require("./bookingRoutes"));
const paymentRoutes = __importDefault(require("./paymentRoutes"));
const withdrawalRoutes = __importDefault(require("./withdrawalRoutes"));
const reviewRoutes = __importDefault(require("./reviewRoutes"));
const adminRoutes = __importDefault(require("./adminRoutes"));
const router = (0, express.Router)();
router.get('/health', (_req, res) => {
    res.json({ success: true, message: 'AutoLease API is running', timestamp: new Date().toISOString() });
});
router.use('/auth', authRoutes.default);
router.use('/users', userRoutes.default);
router.use('/vehicles', vehicleRoutes.default);
router.use('/bookings', bookingRoutes.default);
router.use('/payments', paymentRoutes.default);
router.use('/withdrawals', withdrawalRoutes.default);
router.use('/reviews', reviewRoutes.default);
router.use('/admin', adminRoutes.default);
module.exports = router;
//# sourceMappingURL=index.js.map