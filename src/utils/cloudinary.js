"use strict";

const stream = require("stream");
const cloudinary = __importDefault(require("../config/cloudinary"));
function uploadImage(buffer, folder) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.default.uploader.upload_stream({ folder: `autolease/${folder}`, resource_type: 'image' }, (error, result) => {
            if (error || !result)
                return reject(error || new Error('Upload failed'));
            resolve({ url: result.secure_url, publicId: result.public_id });
        });
        stream.Readable.from(buffer).pipe(stream);
    });
}
async function deleteImage(publicId) {
    await cloudinary.default.uploader.destroy(publicId);
}

module.exports = { uploadImage, deleteImage };
//# sourceMappingURL=cloudinary.js.map