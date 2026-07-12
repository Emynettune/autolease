"use strict";

const stream = require("stream");
const cloudinary = require("../config/cloudinary");
function uploadImage(buffer, folder) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder: `autolease/${folder}`, resource_type: 'image' }, (error, result) => {
            if (error || !result)
                return reject(error || new Error('Upload failed'));
            resolve({ url: result.secure_url, publicId: result.public_id });
        });
        stream.Readable.from(buffer).pipe(uploadStream);
    });
}
async function deleteImage(publicId) {
    await cloudinary.uploader.destroy(publicId);
}

module.exports = { uploadImage, deleteImage };
