"use strict";

const env = require("../config/env");

let redis;
function client() {
    if (!env.env.redis.enabled || !env.env.redis.url)
        return null;
    if (!redis) {
        const Redis = require("ioredis");
        redis = new Redis(env.env.redis.url, { lazyConnect: true, maxRetriesPerRequest: 1 });
        redis.on('error', (error) => console.error('Redis error', error.message));
    }
    return redis;
}

const cacheService = {
    getClient: client,
    async getJson(key) {
        const c = client();
        if (!c)
            return null;
        const value = await c.get(key);
        return value ? JSON.parse(value) : null;
    },
    async setJson(key, value, ttlSeconds = 300) {
        const c = client();
        if (!c)
            return;
        await c.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    },
    async del(key) {
        const c = client();
        if (c)
            await c.del(key);
    },
};

module.exports = { cacheService: cacheService };