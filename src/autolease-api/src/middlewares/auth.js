"use strict";

const jwt = require("../utils/jwt");
const helpers = require("../utils/helpers");
const tokenService = require("../services/tokenService");
const sessionService = require("../services/sessionService");

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        (0, helpers.sendError)(res, 'Authentication required', 401);
        return;
    }
    try {
        const payload = (0, jwt.verifyAccessToken)(authHeader.split(' ')[1]);
        if (await tokenService.tokenService.isBlacklisted(payload.jti)) {
            (0, helpers.sendError)(res, 'Token has been revoked', 401);
            return;
        }
        req.user = payload;
        await sessionService.sessionService.touch(payload.id, req.get('user-agent'), req.ip);
        next();
    }
    catch {
        (0, helpers.sendError)(res, 'Invalid or expired token', 401);
    }
}
const optionalAuthenticate = async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        next();
        return;
    }
    try {
        const payload = (0, jwt.verifyAccessToken)(authHeader.split(' ')[1]);
        if (!(await tokenService.tokenService.isBlacklisted(payload.jti)))
            req.user = payload;
    }
    catch {
    }
    next();
}
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            (0, helpers.sendError)(res, 'Authentication required', 401);
            return;
        }
        if (!roles.includes(req.user.role)) {
            (0, helpers.sendError)(res, 'You do not have the required permissions', 403);
            return;
        }
        next();
    };
}

module.exports = {
    authenticate,
    optionalAuthenticate,
    authorize
};
