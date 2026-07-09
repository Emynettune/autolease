"use strict"

const express = __importDefault(require("express"));
const helmet = __importDefault(require("helmet"));
const cors = __importDefault(require("cors"));
const cookieParser = __importDefault(require("cookie-parser"));
const rateLimit = __importDefault(require("express-rate-limit"));
const routes = __importDefault(require("./routes"));
const error = require("./middlewares/error");
const env = require("./config/env");
const security = require("./middlewares/security");
const swagger = require("./config/swagger");
const app = (0, express.default)();
app.set('trust proxy', env.env.trustProxy ? 1 : 0);
app.use((0, helmet.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
        },
    },
}));
app.use((0, cors.default)({
    origin(origin, callback) {
        if (!origin || env.env.allowedOrigins.includes(origin))
            return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use((0, cookieParser.default)());
app.use('/api/v1/payments/webhook', express.default.raw({ type: 'application/json' }));
app.use(express.default.json({ limit: '10mb' }));
app.use(express.default.urlencoded({ extended: true }));
app.use(security.sanitizeRequest);
app.use(security.csrfProtection);
app.use('/api', (0, rateLimit.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests' },
}));
try {
    const swaggerUi = require('swagger-ui-express');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger.swaggerDocument));
}
catch {
    app.get('/api-docs', (_req, res) => res.json(swagger.swaggerDocument));
}
app.get('/health', (_req, res) => res.json({ success: true, message: 'ok' }));
app.use(security.auditRequests);
app.use('/api/v1', routes.default);
app.use(error.notFoundHandler);
app.use(error.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map
