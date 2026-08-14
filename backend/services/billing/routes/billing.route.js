import express from "express"
import { createCheckoutSession } from "../controllers/billing.controller.js"

const router = express.Router()

const requireUserId = (req, res, next) => {
    const userId = req.headers["x-user-id"]
    if (!userId || typeof userId !== "string" || !userId.trim()) {
        return res.status(401).json({ message: "Unauthorized: Missing user identification header" })
    }
    next()
}

// Creates Stripe Checkout Session — returns { url } to redirect user
router.post("/create-session", requireUserId, createCheckoutSession)

export default router