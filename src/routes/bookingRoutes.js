"use strict";

const express = require("express");
const controllers = __importDefault(require("../controllers"));
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const enums = require("../types/enums");
const router = (0, express.Router)();
router.use(auth.authenticate);
router.post('/', (0, auth.authorize)(enums.UserRole.CUSTOMER), (0, validate.validateBody)(schemas.createBookingSchema), controllers.default.booking.create);
router.get('/', (0, validate.validateQuery)(schemas.paginationSchema), controllers.default.booking.getMine);
router.get('/:id', controllers.default.booking.getById);
router.post('/:id/cancel', (0, auth.authorize)(enums.UserRole.CUSTOMER), (0, validate.validateBody)(schemas.cancelBookingSchema), controllers.default.booking.cancel);
module.exports = router;
//# sourceMappingURL=bookingRoutes.js.map