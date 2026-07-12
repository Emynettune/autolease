"use strict";

const express = require("express");
const rateLimit = require("express-rate-limit");
const controllers = require("../controllers").auth;
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const env = require("../config/env");
const router = (0, express.Router)();
const authLimiter = (0, rateLimit)({ windowMs: env.env.security.loginWindowMs, max: env.env.security.loginMaxAttempts });
router.post('/register', authLimiter, (0, validate.validateBody)(schemas.registerSchema), controllers.register);
router.post('/login', authLimiter, (0, validate.validateBody)(schemas.loginSchema), controllers.login);
router.post('/google', authLimiter, (0, validate.validateBody)(schemas.googleAuthSchema), controllers.googleLogin);
router.post('/refresh', (0, validate.validateBody)(schemas.refreshTokenSchema), controllers.refresh);
router.post('/logout', auth.optionalAuthenticate, (0, validate.validateBody)(schemas.refreshTokenSchema), controllers.logout);
router.get('/verify-email', controllers.verifyEmail);
router.post('/verify-email', (0, validate.validateBody)(schemas.verifyEmailSchema), controllers.verifyEmail);
router.post('/forgot-password', authLimiter, (0, validate.validateBody)(schemas.forgotPasswordSchema), controllers.forgotPassword);
router.post('/reset-password', (0, validate.validateBody)(schemas.resetPasswordSchema), controllers.resetPassword);
router.post('/change-password', auth.authenticate, (0, validate.validateBody)(schemas.changePasswordSchema), controllers.changePassword);
router.patch('/2fa', auth.authenticate, (0, validate.validateBody)(schemas.twoFactorSettingSchema), controllers.setTwoFactor);

module.exports = router;
