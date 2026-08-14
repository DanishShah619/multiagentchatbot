import api from "../../utils/axios"

export const createOrder = async (plan) => {
    try {
        const { data } = await api.post("/api/billing/create-session", { plan })
        return { success: true, url: data?.url }
    } catch (error) {
        console.error("[createOrder]", error)
        const errorMessage = error.response?.data?.message || "Failed to create checkout session."
        return { success: false, error: errorMessage }
    }
}