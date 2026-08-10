import api from "../../utils/axios"

export const createConversation=async () => {
    try {
        const {data}=await api.post("/api/chat/create-conversation")
        return data
    } catch (error) {
       console.error("[createConversation]", error)
       throw new Error(error.response?.data?.message || "Failed to create conversation")
    }
}