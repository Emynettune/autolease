"use strict";

exports.swaggerDocument = {
    openapi: '3.0.3',
    info: {
        title: 'AutoLease API',
        version: '1.0.0',
        description: 'Car rental and marketplace API',
    },
    servers: [{ url: '/api/v1' }],
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
    },
    paths: {
        '/auth/register': { post: { summary: 'Register a user' } },
        '/auth/login': { post: { summary: 'Login; returns twoFactorRequired when email 2FA is enabled' } },
        '/auth/2fa': { patch: { summary: 'Enable or disable email two-factor authentication', security: [{ bearerAuth: [] }] } },
        '/users/profile': { get: { summary: 'Get current user profile', security: [{ bearerAuth: [] }] } },
        '/users/sessions': { get: { summary: 'List active device sessions', security: [{ bearerAuth: [] }] } },
        '/vehicles': { get: { summary: 'Browse vehicles' }, post: { summary: 'Create vehicle listing', security: [{ bearerAuth: [] }] } },
        '/bookings': { get: { summary: 'List my bookings', security: [{ bearerAuth: [] }] }, post: { summary: 'Create booking', security: [{ bearerAuth: [] }] } },
        '/payments/webhook': { post: { summary: 'Paystack webhook with signature verification' } },
        '/admin/audit-logs': { get: { summary: 'List audit logs', security: [{ bearerAuth: [] }] } },
    },
};

