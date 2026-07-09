"use strict";

const express = require("express");
const rateLimit = __importDefault(require("express-rate-limit"));
const controllers = __importDefault(require("../controllers"));
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const env = require("../config/env");
const router = (0, express.Router)();
const authLimiter = (0, rateLimit.default)({ windowMs: env.env.security.loginWindowMs, max: env.env.security.loginMaxAttempts });
router.post('/register', authLimiter, (0, validate.validateBody)(schemas.registerSchema), controllers.default.auth.register);
router.post('/login', authLimiter, (0, validate.validateBody)(schemas.loginSchema), controllers.default.auth.login);
router.post('/google', authLimiter, (0, validate.validateBody)(schemas.googleAuthSchema), controllers.default.auth.googleLogin);
router.post('/refresh', (0, validate.validateBody)(schemas.refreshTokenSchema), controllers.default.auth.refresh);
router.post('/logout', auth.optionalAuthenticate, (0, validate.validateBody)(schemas.refreshTokenSchema), controllers.default.auth.logout);
router.get('/verify-email', controllers.default.auth.verifyEmail);
router.post('/verify-email', (0, validate.validateBody)(schemas.verifyEmailSchema), controllers.default.auth.verifyEmail);
router.post('/forgot-password', authLimiter, (0, validate.validateBody)(schemas.forgotPasswordSchema), controllers.default.auth.forgotPassword);
router.post('/reset-password', (0, validate.validateBody)(schemas.resetPasswordSchema), controllers.default.auth.resetPassword);
router.post('/change-password', auth.authenticate, (0, validate.validateBody)(schemas.changePasswordSchema), controllers.default.auth.changePassword);
router.patch('/2fa', auth.authenticate, (0, validate.validateBody)(schemas.twoFactorSettingSchema), controllers.default.auth.setTwoFactor);

module.exports = router;
//# sourceMappingURL=authRoutes.js.map
