"use strict";

const express = require("express");
const controllers = require("../controllers");
const auth = require("../middlewares/auth");
const enums = require("../types/enums");
const router = (0, express.Router)();
const parseWebhook = (req, _res, next) => {
    if (Buffer.isBuffer(req.body)) {
        req.body = JSON.parse(req.body.toString());
    }
    next();
};
router.post('/webhook', parseWebhook, controllers.payment.webhook);
router.get('/callback', controllers.payment.callback);
router.get('/verify', controllers.payment.verify);
router.use(auth.authenticate);
router.post('/initialize/:bookingId', (0, auth.authorize)(enums.UserRole.CUSTOMER), controllers.payment.initialize);
module.exports = router;
