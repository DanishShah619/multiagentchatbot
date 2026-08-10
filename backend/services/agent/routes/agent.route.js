import express from "express"
import { agent } from "../controllers/agent.controller.js"
import multer from "../config/multer.js"

const router=express.Router()

const requireUserId = (req, res, next) => {
    const userId = req.headers["x-user-id"]
    if (!userId || typeof userId !== "string" || !userId.trim()) {
        return res.status(401).json({ message: "Unauthorized: Missing user identification header" })
    }
    next()
}

router.post("/chat", requireUserId, multer.single("file"), agent)

export default router