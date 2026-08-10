import api from '../../utils/axios'

async function sendMessage(payload) {
 try {
    const {data}=await api.post("/api/agent/chat",payload)
    return { success: true, ...data }
 } catch (error) {
    console.error("[sendMessage]", error)
    const errorMessage = error.response?.data?.message || "Failed to send message."
    return { success: false, error: errorMessage }
 }
}

export default sendMessage
