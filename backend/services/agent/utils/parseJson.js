export const cleanAndParseJson = (rawContent) => {
    if (!rawContent) {
        throw new Error("Empty response received from LLM.")
    }

    if (typeof rawContent !== "string") {
        return rawContent
    }

    let cleaned = rawContent.trim()

    // Strip markdown code fences if present (e.g. ```json ... ```)
    if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
    }

    // Find JSON boundaries
    const firstBrace = cleaned.indexOf("{")
    const firstBracket = cleaned.indexOf("[")

    let startIndex = -1
    let isObject = false
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
        startIndex = firstBrace
        isObject = true
    } else if (firstBracket !== -1) {
        startIndex = firstBracket
        isObject = false
    }

    if (startIndex !== -1) {
        const lastIndex = isObject ? cleaned.lastIndexOf("}") : cleaned.lastIndexOf("]")
        if (lastIndex !== -1 && lastIndex > startIndex) {
            cleaned = cleaned.slice(startIndex, lastIndex + 1)
        }
    }

    try {
        return JSON.parse(cleaned)
    } catch (firstErr) {
        // Sanitize control characters that cause "Bad control character in string literal"
        const sanitized = cleaned
            .replace(/[\n\r\t]/g, (match) => {
                if (match === "\n") return "\\n"
                if (match === "\r") return "\\r"
                if (match === "\t") return "\\t"
                return match
            })
            .replace(/[\x00-\x1F\x7F-\x9F]/g, "")

        try {
            return JSON.parse(sanitized)
        } catch (secondErr) {
            console.error("[cleanAndParseJson] Parsing failed. Raw snippet:", cleaned.slice(0, 300))
            throw new Error(`Failed to parse AI output into valid JSON: ${firstErr.message}`)
        }
    }
}
