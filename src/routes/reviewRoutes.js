"use strict";

const express = require("express");
const controllers = __importDefault(require("../controllers"));
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const enums = require("../types/enums");
const router = (0, express.Router)();
router.get('/vehicle/:vehicleId', (0, validate.validateQuery)(schemas.paginationSchema), controllers.default.review.getVehicle);
router.use(auth.authenticate);
router.post('/', (0, auth.authorize)(enums.UserRole.CUSTOMER), (0, validate.validateBody)(schemas.createReviewSchema), controllers.default.review.create);
router.patch('/:id', (0, auth.authorize)(enums.UserRole.CUSTOMER), (0, validate.validateBody)(schemas.updateReviewSchema), controllers.default.review.update);
router.delete('/:id', (0, auth.authorize)(enums.UserRole.CUSTOMER), controllers.default.review.delete);
module.exports = router;
//# sourceMappingURL=reviewRoutes.js.map