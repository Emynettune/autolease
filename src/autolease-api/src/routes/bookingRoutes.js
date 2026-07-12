"use strict";

const express = require("express");
const controllers = require("../controllers");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const enums = require("../types/enums");
const router = (0, express.Router)();
router.use(auth.authenticate);
router.post('/', (0, auth.authorize)(enums.UserRole.CUSTOMER), (0, validate.validateBody)(schemas.createBookingSchema), controllers.booking.create);
router.get('/', (0, validate.validateQuery)(schemas.paginationSchema), controllers.booking.getMine);
router.get('/:id', controllers.booking.getById);
router.post('/:id/cancel', (0, auth.authorize)(enums.UserRole.CUSTOMER), (0, validate.validateBody)(schemas.cancelBookingSchema), controllers.booking.cancel);
module.exports = router;
