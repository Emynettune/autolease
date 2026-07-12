"use strict";

const dotenv = require("dotenv");
dotenv.config();
function requireEnv(key, fallback, options = {}) {
    const value = process.env[key] ?? fallback;
    if (!value || (options.rejectDevFallback && env?.nodeEnv === 'production' && value === fallback))
        throw new TypeError(`Missing required environment variable: ${key}`);
    return value;
}
function boolEnv(key, fallback = false) {
    const value = process.env[key];
    if (value === undefined)
        return fallback;
    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}
function listEnv(key, fallback = '') {
    return (process.env[key] || fallback)
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
}
const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    allowedOrigins: listEnv('ALLOWED_ORIGINS', process.env.CLIENT_URL || 'http://localhost:5173'),
    trustProxy: boolEnv('TRUST_PROXY', true),
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || 'autolease',
    },
    jwt: {
        accessSecret: requireEnv('JWT_ACCESS_SECRET', 'dev_access_secret'),
        refreshSecret: requireEnv('JWT_REFRESH_SECRET', 'dev_refresh_secret'),
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    security: {
        csrfProtectionEnabled: boolEnv('CSRF_PROTECTION_ENABLED', false),
        twoFactorEnabledByDefault: boolEnv('TWO_FACTOR_ENABLED_BY_DEFAULT', false),
        loginWindowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || '900000', 10),
        loginMaxAttempts: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '10', 10),
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    paystack: {
        secretKey: process.env.PAYSTACK_SECRET_KEY || '',
        publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
    },
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
        apiKey: process.env.CLOUDINARY_API_KEY || '',
        apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    },
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
        from: process.env.EMAIL_FROM || 'AutoLease <noreply@autolease.com>',
    },
    redis: {
        url: process.env.REDIS_URL || '',
        enabled: boolEnv('REDIS_ENABLED', false),
    },
    queues: {
        enabled: boolEnv('QUEUE_ENABLED', false),
    },
    platformCommissionRate: parseFloat(process.env.PLATFORM_COMMISSION_RATE || '0.10'),
};
if (env.nodeEnv === 'production') {
    requireEnv('JWT_ACCESS_SECRET');
    requireEnv('JWT_REFRESH_SECRET');
    if (env.jwt.accessSecret === 'dev_access_secret' || env.jwt.refreshSecret === 'dev_refresh_secret') {
        throw new TypeError('Production JWT secrets must not use development defaults');
    }
}

module.exports = { env };
