import axios from "axios"

export const deductCredits=async (userId,agent)=>{
    try {
       const internalSecret = process.env.INTERNAL_SECRET || "cortexai-internal-secret-key-2026"
       const {data}=await axios.post(
          `${process.env.AUTH_SERVICE}/deduct-credits`,
          {userId,agent},
          {headers:{"x-internal-secret": internalSecret}}
       )
       return data
    } catch (error) {
        console.error("[deductCredits]", error?.response?.data || error?.message)
        return null
    }
}