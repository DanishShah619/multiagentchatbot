import { getModel } from "../config/llmModels.js"

// SEC-10: Canonical whitelist — single source of truth for valid agent identifiers
const VALID_AGENTS = new Set(["chat", "search", "coding", "pdf", "ppt", "vision", "pdfRag", "imageAnalyzer"])

export const router = async (state) => {

  if (state.agent && state.agent !== "auto") {
    // SEC-10: Even client-supplied explicit agents must be whitelisted
    const sanitized = VALID_AGENTS.has(state.agent) ? state.agent : "chat"
    return {
      ...state,
      agent: sanitized
    }
  }

  if(state.file){
if(state.file.mimetype==="application/pdf"){
    return {
      ...state,
      agent:"pdfRag"
    }
  }

    if(state.file.mimetype.startsWith("image/")){
    return {
      ...state,
      agent:"imageAnalyzer"
    }
  }
  }

  


  const llm = await getModel("router")
  const prompt = `You are an agent router.

Available agents:

- chat
- search
- coding
- pdf
- ppt
- vision 

Rules:

chat:
General conversation,
explanations,
learning,
questions.

search:
Current events,
latest information,
news,
recent developments,
internet lookup.

coding:
Generate code,
debug code,
build projects,
architecture,
API design.

pdf:
Questions about generate PDFs
or document context.

ppt:
Questions about generate ppts
or ppt context.

vision:
  Generate image,
  create image

Return ONLY one word:

chat
search
coding
pdf
ppt
vision

User Query:
 ${state.prompt}
`

  const response = await llm.invoke(prompt)

  // SEC-10: Whitelist LLM output — use the same canonical Set defined at module scope
  const routed = response.content.trim().toLowerCase()

  return {
    ...state,
    agent: VALID_AGENTS.has(routed) ? routed : "chat"
  }



}