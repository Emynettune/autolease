"use strict";
const repositories = require("../repositories");

exports.sessionService = {
    async create({ userId, refreshTokenId, userAgent, ipAddress }) {
        return repositories.repositories.deviceSessions().save({
            userId,
            refreshTokenId,
            userAgent: userAgent || null,
            ipAddress: ipAddress || null,
            lastSeenAt: new Date(),
        });
    },
    async touch(userId, userAgent, ipAddress) {
        const repo = repositories.repositories.deviceSessions();
        const session = await repo.findOne({
            where: { userId, userAgent: userAgent || null, ipAddress: ipAddress || null, revokedAt: null },
            order: { createdAt: 'DESC' },
        });
        if (session) {
            session.lastSeenAt = new Date();
            await repo.save(session);
        }
    },
    async list(userId) {
        return repositories.repositories.deviceSessions().find({
            where: { userId, revokedAt: null },
            order: { lastSeenAt: 'DESC' },
        });
    },
    async revoke(userId, sessionId) {
        const repo = repositories.repositories.deviceSessions();
        const session = await repo.findOne({ where: { id: sessionId, userId, revokedAt: null } });
        if (!session)
            return false;
        session.revokedAt = new Date();
        await repo.save(session);
        return true;
    },
};

