import api from "../../utils/axios"

export const createOrder=async (plan) => {
    try {
        const {data}=await api.post("/api/billing/create",{plan})
        return { success: true, ...data }
    } catch (error) {
        console.error("[createOrder]", error)
        const errorMessage = error.response?.data?.message || "Failed to create order."
        return { success: false, error: errorMessage }
    }
}