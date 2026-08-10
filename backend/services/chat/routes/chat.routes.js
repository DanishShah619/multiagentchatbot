import express from "express"
import { createConversation, deleteConversation, getConversations, getMessages, saveMessage, updateConversation } from "../controllers/chat.controller.js"

const router=express.Router()

const requireUserId = (req, res, next) => {
    const userId = req.headers["x-user-id"]
    if (!userId || typeof userId !== "string" || !userId.trim()) {
        return res.status(401).json({ message: "Unauthorized: Missing user identification header" })
    }
    next()
}

router.use(requireUserId)

router.get("/create-conversation",createConversation)
router.post("/create-conversation",createConversation)
router.get("/get-conversations",getConversations)
router.post("/update-conversation",updateConversation)
router.delete("/delete-conversation/:id",deleteConversation)
router.post("/save-message",saveMessage)
router.get("/get-messages/:conversationId",getMessages)
export default router