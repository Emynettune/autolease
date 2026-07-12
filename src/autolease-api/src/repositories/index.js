"use strict";

const data_source = require("../database/data-source");

function repo(name) {
    return (0, data_source.getRepo)(name);
}

const repositories = {
    users: () => repo('User'),
    auditLogs: () => repo('AuditLog'),
    refreshTokens: () => repo('RefreshToken'),
    blacklistedTokens: () => repo('BlacklistedToken'),
    deviceSessions: () => repo('DeviceSession'),
};

module.exports = { repositories };

