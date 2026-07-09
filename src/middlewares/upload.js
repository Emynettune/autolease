"use strict";

const multer = __importDefault(require("multer"));
exports.upload = (0, multer.default)({
    storage: multer.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        cb(null, file.mimetype.startsWith('image/'));
    },
});

module.exports = {
    upload: exports.upload
};
//# sourceMappingURL=upload.js.map