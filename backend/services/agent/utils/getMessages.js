import axios from "axios"

export const getMessages=async (conversationId, userId)=>{
    try {
        const internalSecret = process.env.INTERNAL_SECRET || "cortexai-internal-secret-key-2026"
        const headers = { "x-internal-secret": internalSecret }
        if (userId) headers["x-user-id"] = userId

        const {data}=await axios.get(`${process.env.CHAT_SERVICE}/get-messages/${conversationId}`, { headers })
        return data
    } catch (error) {
        console.log("[getMessages]", error?.message)
        return []
    }
}