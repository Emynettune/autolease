"use strict";

const bcryptjs = __importDefault(require("bcryptjs"));
async function hashPassword(password) {
    return bcryptjs.default.hash(password, 12);
}
async function comparePassword(password, hash) {
    return bcryptjs.default.compare(password, hash);
}

module.exports = {
    hashPassword,
    comparePassword
};
//# sourceMappingURL=password.js.map