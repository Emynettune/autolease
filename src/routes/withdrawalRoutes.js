"use strict";

const express = require("express");
const controllers = __importDefault(require("../controllers"));
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const enums = require("../types/enums");
const router = (0, express.Router)();
router.use(auth.authenticate, (0, auth.authorize)(enums.UserRole.CAR_OWNER));
router.post('/bank-accounts', (0, validate.validateBody)(schemas.addBankAccountSchema), controllers.default.withdrawal.addBank);
router.get('/bank-accounts', controllers.default.withdrawal.getBanks);
router.post('/request', (0, validate.validateBody)(schemas.withdrawalSchema), controllers.default.withdrawal.request);
router.get('/history', (0, validate.validateQuery)(schemas.paginationSchema), controllers.default.withdrawal.history);
module.exports = router;
//# sourceMappingURL=withdrawalRoutes.js.map