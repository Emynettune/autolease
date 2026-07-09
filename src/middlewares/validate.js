"use strict";

const helpers = require("../utils/helpers");
function formatZodErrors(error, fallbackKey) {
    const errors = {};
    error.errors.forEach((err) => {
        const key = err.path.join('.') || fallbackKey;
        if (!errors[key])
            errors[key] = [];
        errors[key].push(err.message);
    });
    return errors;
}
function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            (0, helpers.sendError)(res, 'Validation failed', 422, formatZodErrors(result.error, 'body'));
            return;
        }
        req.body = result.data;
        next();
    };
}
function validateQuery(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            (0, helpers.sendError)(res, 'Validation failed', 422, formatZodErrors(result.error, 'query'));
            return;
        }
        req.query = result.data;
        next();
    };
}

module.exports = {
    validateBody,
    validateQuery
};
//# sourceMappingURL=validate.js.map