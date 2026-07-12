"use strict";
const repositories = require("../repositories");
module.exports = {
    async create({ userId, refreshTokenId, userAgent, ipAddress }) {
        return repositories.repositories.deviceSessions().save({
            userId,
            refreshTokenId,
            userAgent,
            ipAddress,
        });
    },
    async findByRefreshTokenId(refreshTokenId) {
        return repositories.repositories.deviceSessions().findOne({ where: { refreshTokenId } });
    },
    async deleteByRefreshTokenId(refreshTokenId) {
        return repositories.repositories.deviceSessions().delete({ where: { refreshTokenId } });
    },
};