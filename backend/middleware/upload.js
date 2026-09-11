const multer = require("multer");
const { Readable } = require("stream");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();

const multerUpload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(
                new Error(
                    "Only JPG, PNG, and WEBP images are allowed"
                )
            );
        }

        cb(null, true);
    }
});

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "bookstore/books",
                resource_type: "image"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        Readable.from(buffer).pipe(uploadStream);
    });
};

const single = (fieldName) => {
    const multerMiddleware = multerUpload.single(fieldName);

    return async (req, res, next) => {
        multerMiddleware(req, res, async (err) => {
            if (err) {
                return next(err);
            }

            if (!req.file) {
                return next();
            }

            try {
                const result = await uploadToCloudinary(
                    req.file.buffer
                );

                // Keep compatibility with the existing
                // book controller.
                req.file.path = result.secure_url;
                req.file.filename = result.public_id;

                // Buffer is no longer needed after upload.
                delete req.file.buffer;

                next();
            } catch (error) {
                next(error);
            }
        });
    };
};

module.exports = {
    single
};