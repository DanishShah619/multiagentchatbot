import api from "../../utils/axios"

export const verifyPayment=async (payload) => {
    try {
        const {data}=await api.post("/api/billing/verify",payload)
        return { success: true, ...data }
    } catch (error) {
        console.error("[verifyPayment]", error)
        const errorMessage = error.response?.data?.message || "Payment verification failed."
        return { success: false, error: errorMessage }
    }
}