"use strict";

const crypto = require("crypto");
const env = require("../config/env");
const auditService = require("../services/auditService");

function escapeHtml(value) {
    return value.replace(/[&<>"'`]/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;',
    }[char]));
}

function sanitizeValue(value) {
    if (typeof value === 'string')
        return escapeHtml(value.trim());
    if (Array.isArray(value))
        return value.map(sanitizeValue);
    if (value && typeof value === 'object') {
        return Object.keys(value).reduce((acc, key) => {
            acc[key] = sanitizeValue(value[key]);
            return acc;
        }, {});
    }
    return value;
}

function sanitizeRequest(req, _res, next) {
    if (req.body && !Buffer.isBuffer(req.body))
        req.body = sanitizeValue(req.body);
    if (req.query)
        req.query = sanitizeValue(req.query);
    if (req.params)
        req.params = sanitizeValue(req.params);
    next();
}

function csrfProtection(req, res, next) {
    if (!env.env.security.csrfProtectionEnabled || ['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        next();
        return;
    }
    const hasBearerToken = req.headers.authorization?.startsWith('Bearer ');
    if (hasBearerToken) {
        next();
        return;
    }
    const cookieToken = req.cookies?.csrfToken;
    const headerToken = req.headers['x-csrf-token'];
    const cookieBuffer = Buffer.from(String(cookieToken || ''));
    const headerBuffer = Buffer.from(String(headerToken || ''));
    if (cookieToken && headerToken && cookieBuffer.length === headerBuffer.length && crypto.timingSafeEqual(cookieBuffer, headerBuffer)) {
        next();
        return;
    }
    res.status(403).json({ success: false, message: 'Invalid CSRF token' });
}

function auditRequests(req, res, next) {
    const startedAt = Date.now();
    res.on('finish', () => {
        if (req.path.includes('/audit-logs') || req.path.includes('/health'))
            return;
        if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method))
            return;
        auditService.auditService.record({
            userId: req.user?.id,
            action: `${req.method} ${req.originalUrl}`,
            metadata: { statusCode: res.statusCode, durationMs: Date.now() - startedAt },
            ipAddress: req.ip,
        });
    });
    next();
}

module.exports = {
    sanitizeRequest,
    csrfProtection,
    auditRequests
};
