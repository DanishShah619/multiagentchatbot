import { getModel } from "../config/llmModels.js"
import { generatePpt } from "../utils/generatePpt.js"
import { uploadBufferToCloudinary } from "../utils/cloudinary.js"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"
import { cleanAndParseJson } from "../utils/parseJson.js"

export const pptAgent=async (state) => {
    try {
        await checkAgentLimit(state.userId,"ppt")
        const llm=await getModel("ppt")
        const prompt=`You are a professional presentation designer.

Return ONLY valid JSON.

Format:

{
"title":"",
"subtitle":"",
"slides":[
{
"title":"",
"points":[
"",
"",
"",
""
]
}
]
}

Rules:

- Generate exactly 6 content slides.
- Each slide should have 4-6 concise bullet points.
- No markdown.
- No explanation.
- No code block.
- Return ONLY JSON.

Topic:

${state.prompt}`

const res=await llm.invoke(prompt)
const data=cleanAndParseJson(res.content)
await deductCredits(state.userId,"ppt")
const ppt=await generatePpt(data)
const buffer=await ppt.write({
    outputType:"nodebuffer"
})

const filename=`ppt-${Date.now()}.pptx`
const uploadResult = await uploadBufferToCloudinary(buffer, filename, "cortexai_ppts")
const downloadUrl = uploadResult?.url || "#"

return {
    ...state,
    artifacts: [downloadUrl],
    aiResponse:`# ✅ Presentation Generated

**${data.title}**

📥 [Download PPT](${downloadUrl})`
}

    } catch (error) {
        console.log(error)
         return {
            ...state,
            aiResponse:error?.data?.message || "failed to generate ppt"
        }
    }
}