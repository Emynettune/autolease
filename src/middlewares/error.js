"use strict";


const helpers = require("../utils/helpers");
const env = require("../config/env");
const errorHandler = (err, req, res, _next) => {
    if (err instanceof helpers.AppError) {
        (0, helpers.sendError)(res, err.message, err.statusCode, err.errors);
        return;
    }
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, err);
    const message = env.env.nodeEnv === 'production' ? 'Internal server error' : err.message;
    (0, helpers.sendError)(res, message, 500);
};
exports.errorHandler = errorHandler;
function notFoundHandler(_req, res) {
    (0, helpers.sendError)(res, 'Route not found', 404);
}

module.exports = {
    errorHandler,
    notFoundHandler
};
//# sourceMappingURL=error.js.map