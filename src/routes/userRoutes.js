"use strict";

const express = require("express");
const controllers = __importDefault(require("../controllers"));
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const schemas = require("../validators/schemas");
const router = (0, express.Router)();
router.use(auth.authenticate);
router.get('/profile', controllers.default.user.getProfile);
router.patch('/profile', (0, validate.validateBody)(schemas.updateProfileSchema), controllers.default.user.updateProfile);
router.post('/profile/picture', upload.upload.single('picture'), controllers.default.user.uploadPicture);
router.get('/wallet', controllers.default.user.getWallet);
router.get('/wallet/transactions', (0, validate.validateQuery)(schemas.paginationSchema), controllers.default.user.getWalletTx);
router.get('/rentals', (0, validate.validateQuery)(schemas.paginationSchema), controllers.default.user.getRentals);
router.get('/payments', (0, validate.validateQuery)(schemas.paginationSchema), controllers.default.user.getPayments);
router.get('/sessions', controllers.default.user.getSessions);
router.delete('/sessions/:id', controllers.default.user.revokeSession);
module.exports = router;
//# sourceMappingURL=userRoutes.js.map
