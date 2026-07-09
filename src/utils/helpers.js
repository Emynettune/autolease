"use strict";


const crypto = require("crypto");
class AppError extends Error {
    constructor(message, statusCode = 400, errors) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
    }
}

function sendSuccess(res, message, data, statusCode = 200, meta) {
    const body = { success: true, message, data };
    if (meta !== undefined)
        body.meta = meta;
    return res.status(statusCode).json(body);
}
function sendError(res, message, statusCode = 400, errors) {
    return res.status(statusCode).json({ success: false, message, errors });
}
function parsePagination(query) {
    const page = Math.max(1, parseInt(String(query.page || '1'), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || '10'), 10)));
    const sortBy = String(query.sortBy || 'createdAt');
    const sortOrder = String(query.sortOrder || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    const search = query.search ? String(query.search) : undefined;
    return { page, limit, sortBy, sortOrder, search, skip: (page - 1) * limit };
}
function buildMeta(total, page, limit) {
    return { page, limit, total, totalPages: Math.ceil(total / limit) || 1 };
}
function getParam(req, key) {
    const value = req.params[key];
    return Array.isArray(value) ? value[0] : value;
}
function sanitizeUser(user) {
    const { password, emailVerificationToken, passwordResetToken, passwordResetExpires, ...safe } = user;
    return safe;
}
function generateToken(length = 32) {
    return (0, crypto.randomBytes)(length).toString('hex');
}
function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

module.exports = {
    AppError,
    sendSuccess,
    sendError,
    parsePagination,
    buildMeta,
    getParam,
    sanitizeUser,
    generateToken,
    calculateDays
};
//# sourceMappingURL=helpers.js.map