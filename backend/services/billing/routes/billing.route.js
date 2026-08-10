import express from "express"
import { createOrder, verifyPayment } from "../controllers/billing.controller.js"
const router=express.Router()

const requireUserId = (req, res, next) => {
    const userId = req.headers["x-user-id"]
    if (!userId || typeof userId !== "string" || !userId.trim()) {
        return res.status(401).json({ message: "Unauthorized: Missing user identification header" })
    }
    next()
}

router.post("/create",requireUserId,createOrder)
router.post("/verify",verifyPayment)

export default router