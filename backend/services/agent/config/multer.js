import fs from "fs"
import path from "path"
import crypto from "crypto"
import multer from "multer"
const uploadDir = path.resolve("./temp")

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir)
    },
    filename(req, file, cb) {
        // SEC-09: Use only the file extension from originalname (never the full name)
        // to prevent path traversal. Combine with timestamp + UUID for uniqueness.
        const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, "")
        const safeName = `${Date.now()}-${crypto.randomUUID()}${ext}`
        cb(null, safeName)
    },
})

const ALLOWED_MIME_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp", "image/gif"])

const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
        cb(null, true)
    } else {
        // SEC-09: Store validation error on req so the route handler can return 400
        req.fileValidationError = `Unsupported file type: ${file.mimetype}. Only PDF and images (JPEG, PNG, WebP, GIF) are allowed.`
        cb(null, false)
    }
}

export default multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024  // 20 MB
    }
})