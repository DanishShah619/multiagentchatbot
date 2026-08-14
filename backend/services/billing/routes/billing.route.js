import express from "express"
import { createCheckoutSession, stripeWebhook } from "../controllers/billing.controller.js"

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

// Stripe calls this webhook directly after payment succeeds.
// CRITICAL: Must use express.raw() middleware (not JSON) so Stripe can verify the signature.
// This is mounted BEFORE express.json() in index.js.
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook
)

export default router