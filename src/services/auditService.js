"use strict";
const { repositories } = require("../repositories");

exports.auditService = {
    async record({ userId, action, entity, entityId, metadata, ipAddress }) {
        try {
            await repositories.auditLogs().save({
                userId: userId ?? null,
                action,
                entity: entity ?? null,
                entityId: entityId ?? null,
                metadata: metadata ?? null,
                ipAddress: ipAddress ?? null,
            });
        } catch (error) {
            console.error('Failed to write audit log', error);
        }
    }
};

