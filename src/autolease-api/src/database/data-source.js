"use strict";


require("reflect-metadata");
const typeorm = require("typeorm");
const env = require("../config/env");
const schemas = require("../models/schemas");

const AppDataSource = new typeorm.DataSource({
    type: 'postgres',
    host: env.env.db.host,
    port: env.env.db.port,
    username: env.env.db.username,
    password: env.env.db.password,
    database: env.env.db.name,
    synchronize: env.env.nodeEnv === 'development',
    logging: false,
    entities: Object.values(schemas),
    migrations: ["./src/migrations/*.js"]
});
async function initializeDatabase() {
    if (!AppDataSource.isInitialized)
        await AppDataSource.initialize();
}
function getRepo(name) {
    return AppDataSource.getRepository(name);
}

module.exports = {
    AppDataSource: AppDataSource,
    initializeDatabase: initializeDatabase,
    getRepo: getRepo
};
