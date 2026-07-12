"use strict";

const express = require("express");
const controllers = require("../controllers");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const enums = require("../types/enums");
const router = (0, express.Router)();
router.get('/vehicle/:vehicleId', (0, validate.validateQuery)(schemas.paginationSchema), controllers.review.getVehicle);
router.use(auth.authenticate);
router.post('/', (0, auth.authorize)(enums.UserRole.CUSTOMER), (0, validate.validateBody)(schemas.createReviewSchema), controllers.review.create);
router.patch('/:id', (0, auth.authorize)(enums.UserRole.CUSTOMER), (0, validate.validateBody)(schemas.updateReviewSchema), controllers.review.update);
router.delete('/:id', (0, auth.authorize)(enums.UserRole.CUSTOMER), controllers.review.delete);
module.exports = router;
