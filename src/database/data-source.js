"use strict";


require("reflect-metadata");
const typeorm = require("typeorm");
const env = require("../config/env");
const schemas = require("../models/schemas");
exports.AppDataSource = new typeorm.DataSource({
    type: 'postgres',
    host: env.env.db.host,
    port: env.env.db.port,
    username: env.env.db.username,
    password: env.env.db.password,
    database: env.env.db.name,
    synchronize: env.env.nodeEnv === 'development',
    logging: env.env.nodeEnv === 'development',
    entities: schemas.entities,
    migrations: [ "/migrations/*.js"]
});
async function initializeDatabase() {
    if (!exports.AppDataSource.isInitialized)
        await exports.AppDataSource.initialize();
}
function getRepo(name) {
    return exports.AppDataSource.getRepository(name);
}

module.exports = {
    AppDataSource: exports.AppDataSource,
    initializeDatabase: initializeDatabase,
    getRepo: getRepo
};
//# sourceMappingURL=data-source.js.map