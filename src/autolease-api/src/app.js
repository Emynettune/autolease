"use strict"

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const routes = require("./routes");
const error = require("./middlewares/error");
const env = require("./config/env");
const security = require("./middlewares/security");
const swagger = require("./config/swagger");
const app = (0, express)();
const allowedOrigins = env.env.ALLOWED_ORIGINS
const authRoutes = require("./routes/authRoutes");

app.set('trust proxy', env.env.trustProxy ? 1 : 0);
app.use((0, helmet)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
        },
    },
}));

app.use(express.json());
app.use('/auth', authRoutes);
app.use((0, cors)({
    origin(origin, callback) {
        if (!origin || env.env.allowedOrigins.includes(origin))
            return callback(null, true);
       if (allowedOrigins.indexOf(origin) !== -1) {
        const message = 'The CORS policy for this site does not allow access from the specified Origin.';
       return callback(new Error(message), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use((0, cookieParser)());
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.urlencoded({ extended: true }));
app.use(security.sanitizeRequest);
app.use(security.csrfProtection);
app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests' },
}));
try {
    const swaggerUi = require('swagger-ui-express');
    const swaggerSpec = require('./config/swagger');
    const CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css';
    const JS_URL = [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ];

    app.use(
        '/api-docs', 
        swaggerUi.serve,
         swaggerUi.setup(swaggerSpec , {
            customCssUrl: CSS_URL,
            customJs: JS_URL,
            swaggerOptions: {
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
            },
        })
    );
}
               
        
catch {
    app.get('/api-docs', (_req, res) => res.json(swagger.swaggerDocument));
}
app.get('/health', (_req, res) => res.json({ success: true, message: 'ok' }));
app.use(security.auditRequests);
app.use('/api/v1', routes);
app.use(error.notFoundHandler);
app.use(error.errorHandler);
module.exports = app;
