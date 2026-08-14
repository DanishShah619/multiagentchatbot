import { getModel } from "../config/llmModels.js"
import axios from "axios"
import { uploadBufferToCloudinary } from "../utils/cloudinary.js"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"
export const visionAgent=async (state) => {

    try {
        await checkAgentLimit(state.userId,"image")
         const llm=await getModel("image")
    const res=await llm.invoke(`
        You are an elite AI image prompt engineer.

Convert the user request into a highly detailed image generation prompt.

Requirements:

- Cinematic lighting
- Professional composition
- Ultra realistic
- High detail
- Beautiful color palette
- Sharp focus
- 8K quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Return only the image prompt.

User Request:
${state.prompt}

        `)

const prompt=res.content.trim()

const imageUrl=`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`

const imageRes=await axios.get(imageUrl,{responseType:"arraybuffer"})
await deductCredits(state.userId,"vision")
const buffer=Buffer.from(imageRes.data)
const filename=`image-${Date.now()}.png`

const uploadResult = await uploadBufferToCloudinary(buffer, filename, "cortexai_vision")
const downloadUrl = uploadResult?.url || imageUrl

return {
    ...state,
    images: [downloadUrl],
    aiResponse:`
![Generated Image](${downloadUrl})

📥 [Download Image](${downloadUrl})`
}
    } catch (error) {
       console.log(error)
         return {
            ...state,
            aiResponse:error?.data?.message || "failed to generate image"
        }
    }
   



}