
const jsonwebtoken = __importDefault(require("jsonwebtoken"));
const { randomUUID } = require("crypto");
const env = require("../config/env");

function signAccessToken(payload) {
    return jsonwebtoken.default.sign(payload, env.env.jwt.accessSecret, { expiresIn: env.env.jwt.accessExpiresIn, jwtid: randomUUID() });
}
function signRefreshToken(payload) {
    return jsonwebtoken.default.sign(payload, env.env.jwt.refreshSecret, { expiresIn: env.env.jwt.refreshExpiresIn, jwtid: randomUUID() });
}
function verifyAccessToken(token) {
    return jsonwebtoken.default.verify(token, env.env.jwt.accessSecret);
}
function verifyRefreshToken(token) {
    return jsonwebtoken.default.verify(token, env.env.jwt.refreshSecret);
}
function getRefreshTokenExpiry() {
    const days = parseInt(env.env.jwt.refreshExpiresIn.replace(/\D/g, ''), 10) || 7;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);
    return expiry;
}

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    getRefreshTokenExpiry
};
//# sourceMappingURL=jwt.js.map
