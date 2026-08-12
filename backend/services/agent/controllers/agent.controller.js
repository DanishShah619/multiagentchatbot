import fs from "fs"
import axios from "axios"
import { graph } from "../graph/graph.js"
import { addMessage } from "../config/memory.js"
import { deductCredits } from "../utils/deductCredits.js"
import { uploadToCloudinary } from "../utils/cloudinary.js"

const refundCredits = async (userId, agent) => {
    try {
        const internalSecret = process.env.INTERNAL_SECRET || "cortexai-internal-secret-key-2026"
        await axios.post(
            `${process.env.AUTH_SERVICE}/refund-credits`,
            { userId, agent },
            { headers: { "x-internal-secret": internalSecret } }
        )
    } catch (err) {
        console.error("[agent/refundCredits]", err?.message)
    }
}

export const agent = async (req, res, next) => {
    let creditDeducted = false
    let targetAgent = "chat"
    let userId = req.headers["x-user-id"]

    try {
        const { prompt, conversationId, agent } = req.body
        const file = req.file
        targetAgent = agent || "chat"

        // SEC-09: Reject invalid file type before any processing or credit deduction
        if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError })
        }

        const creditRes = await deductCredits(userId, targetAgent)
        if (!creditRes || !creditRes.success) {
            return res.status(400).json({ message: creditRes?.message || "Insufficient credits." })
        }
        creditDeducted = true

        let fileUrl = null
        if (file) {
            const uploadRes = await uploadToCloudinary(file.path)
            if (uploadRes) {
                fileUrl = uploadRes.url
            }
        }

        await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
            conversationId, role: "user", content: prompt
        })

        const result = await graph.invoke({
            prompt, conversationId, agent: targetAgent, userId, file, fileUrl
        })

        await addMessage(conversationId, "user", prompt)
        await addMessage(conversationId, "assistant", result.aiResponse)
        await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
            conversationId, role: "assistant", content: result?.aiResponse, images: result?.images, artifacts: result?.artifacts
        })

        return res.status(200).json({
            answer: result?.aiResponse,
            images: result?.images,
            artifacts: result?.artifacts,
            remainingCredits: creditRes.credits
        })

    } catch (error) {
        // OPT-01: Refund credits if graph invocation or processing failed after deduction
        if (creditDeducted && userId) {
            console.log(`[Agent] Failure during processing. Refunding credits for user ${userId}`)
            await refundCredits(userId, targetAgent)
        }
        next(error)
    } finally {
        // OPT-13: Guaranteed cleanup of uploaded temporary file to prevent disk exhaustion
        if (req.file && req.file.path) {
            fs.promises.unlink(req.file.path).catch(err => {
                console.error("[OPT-13] Failed to cleanup temp file:", req.file.path, err.message)
            })
        }
    }
}