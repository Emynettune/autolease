"use strict";

const express = require("express");
const controllers = require("../controllers");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const enums = require("../types/enums");
const router = (0, express.Router)();
router.use(auth.authenticate, (0, auth.authorize)(enums.UserRole.ADMIN));
router.get('/analytics', controllers.admin.analytics);
router.get('/users', (0, validate.validateQuery)(schemas.paginationSchema), controllers.admin.getUsers);
router.patch('/users/:id/suspend', controllers.admin.suspendUser);
router.patch('/users/:id/activate', controllers.admin.activateUser);
router.patch('/users/:id/verify-owner', controllers.admin.verifyOwner);
router.patch('/vehicles/:id/suspend', controllers.admin.suspendVehicle);
router.get('/payments', (0, validate.validateQuery)(schemas.paginationSchema), controllers.admin.getPayments);
router.get('/payments/failed', (0, validate.validateQuery)(schemas.paginationSchema), controllers.admin.getFailedPayments);
router.get('/audit-logs', (0, validate.validateQuery)(schemas.paginationSchema), controllers.admin.getAuditLogs);
router.get('/withdrawals/pending', (0, validate.validateQuery)(schemas.paginationSchema), controllers.admin.pendingWithdrawals);
router.patch('/withdrawals/:id/approve', controllers.admin.approveWithdrawal);
router.patch('/withdrawals/:id/reject', controllers.admin.rejectWithdrawal);

module.exports = router;
