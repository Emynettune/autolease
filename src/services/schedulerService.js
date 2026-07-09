"use strict";

const data_source = require("../database/data-source");

function schedule(name, intervalMs, task) {
    const run = () => task().catch((error) => console.error(`Scheduled job failed: ${name}`, error));
    run();
    return setInterval(run, intervalMs);
}

exports.schedulerService = {
    start() {
        return [
            schedule('token-cleanup', 60 * 60 * 1000, async () => {
                await (0, data_source.getRepo)('BlacklistedToken')
                    .createQueryBuilder()
                    .delete()
                    .where('expiresAt < :now', { now: new Date() })
                    .execute();
            }),
        ];
    },
};

