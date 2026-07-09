"use strict";

const cloudinary = require("cloudinary");
const env = require("./env");
cloudinary.config({
    cloud_name: env.env.cloudinary.cloudName,
    api_key: env.env.cloudinary.apiKey,
    api_secret: env.env.cloudinary.apiSecret,
});

module.exports = cloudinary;
//# sourceMappingURL=cloudinary.js.map