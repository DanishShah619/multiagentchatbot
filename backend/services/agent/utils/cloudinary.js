import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

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
