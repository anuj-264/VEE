import multer from 'multer';
import path from 'path';
import slugify from 'slugify';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //cb(error, destination)
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);

        // Sanitize the base name using slugify
        const sanitizedBaseName = slugify(baseName, { lower: true, strict: true });

        cb(null, `${sanitizedBaseName}-${uniqueSuffix}${ext}`)
    }
})

export const upload = multer({ storage });