"use strict";

const express = require("express");
const controllers = require("../controllers");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const schemas = require("../validators/schemas");
const enums = require("../types/enums");
const router = (0, express.Router)();
router.use(auth.authenticate, (0, auth.authorize)(enums.UserRole.CAR_OWNER));
router.post('/bank-accounts', (0, validate.validateBody)(schemas.addBankAccountSchema), controllers.withdrawal.addBank);
router.get('/bank-accounts', controllers.withdrawal.getBanks);
router.post('/request', (0, validate.validateBody)(schemas.withdrawalSchema), controllers.withdrawal.request);
router.get('/history', (0, validate.validateQuery)(schemas.paginationSchema), controllers.withdrawal.history);
module.exports = router;
