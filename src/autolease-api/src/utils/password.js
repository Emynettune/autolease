"use strict";

const bcryptjs = require("bcryptjs");
async function hashPassword(password) {
    return bcryptjs.hash(password, 12);
}
async function comparePassword(password, hash) {
    return bcryptjs.compare(password, hash);
}

module.exports = {
    hashPassword,
    comparePassword
};
