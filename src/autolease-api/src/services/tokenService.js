"use strict";

const repositories = require("../repositories");

const tokenService = {
    async blacklist({ tokenId, userId, expiresAt }) {
        if (!tokenId || !expiresAt)
            return;
        await repositories.repositories.blacklistedTokens().upsert({
            tokenId,
            userId: userId || null,
            expiresAt,
        }, ['tokenId']);
    },
    async isBlacklisted(tokenId) {
        if (!tokenId)
            return false;
        const token = await repositories.repositories.blacklistedTokens().findOne({ where: { tokenId } });
        return Boolean(token && token.expiresAt > new Date());
    },
};

module.exports = { tokenService: tokenService };
