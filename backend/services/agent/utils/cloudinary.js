import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Upload a local file by file path (e.g. from multer disk storage)
export const uploadToCloudinary = async (filePath, folder = "cortexai_uploads") => {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
            console.warn("[Cloudinary] Env vars missing, skipping remote upload.")
            return null
        }

        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: "auto"
        })

        return {
            url: result.secure_url,
            publicId: result.public_id
        }
    } catch (error) {
        console.error("[Cloudinary Error]", error.message)
        return null
    }
}

// Upload in-memory Buffer directly (e.g. generated PDF, generated PPT, or AI-generated image buffer)
export const uploadBufferToCloudinary = (buffer, filename, folder = "cortexai_uploads") => {
    return new Promise((resolve) => {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
            console.warn("[Cloudinary] Env vars missing, skipping remote upload.")
            return resolve(null)
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: filename ? filename.replace(/\.[^/.]+$/, "") : `file-${Date.now()}`,
                resource_type: "auto"
            },
            (error, result) => {
                if (error) {
                    console.error("[Cloudinary Buffer Upload Error]", error.message)
                    return resolve(null)
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id
                })
            }
        )

        uploadStream.end(buffer)
    })
}
