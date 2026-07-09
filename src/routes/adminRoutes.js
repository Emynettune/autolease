"use strict";

const express = require("express");
const controllers = __importDefault(require("../controllers"));
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const enums = require("../types/enums");
const router = (0, express.Router)();
router.use(auth.authenticate, (0, auth.authorize)(enums.UserRole.ADMIN));
router.get('/analytics', controllers.default.admin.analytics);
router.get('/users', (0, validate.validateQuery)(schemas.paginationSchema), controllers.default.admin.getUsers);
router.patch('/users/:id/suspend', controllers.default.admin.suspendUser);
router.patch('/users/:id/activate', controllers.default.admin.activateUser);
router.patch('/users/:id/verify-owner', controllers.default.admin.verifyOwner);
router.patch('/vehicles/:id/suspend', controllers.default.admin.suspendVehicle);
router.get('/payments', (0, validate.validateQuery)(schemas.paginationSchema), controllers.default.admin.getPayments);
router.get('/payments/failed', (0, validate.validateQuery)(schemas.paginationSchema), controllers.default.admin.getFailedPayments);
router.get('/audit-logs', (0, validate.validateQuery)(schemas.paginationSchema), controllers.default.admin.getAuditLogs);
router.get('/withdrawals/pending', (0, validate.validateQuery)(schemas.paginationSchema), controllers.default.admin.pendingWithdrawals);
router.patch('/withdrawals/:id/approve', controllers.default.admin.approveWithdrawal);
router.patch('/withdrawals/:id/reject', controllers.default.admin.rejectWithdrawal);

module.exports = router;
//# sourceMappingURL=adminRoutes.js.map