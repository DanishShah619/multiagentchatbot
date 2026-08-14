import axios from "axios"
import stripe from "../config/stripe.js"
import { PLANS } from "../config/Plans.js"
import Payment from "../models/payment.model.js"

// ─────────────────────────────────────────────────────────────────────────────
// createCheckoutSession
// Creates a Stripe Checkout Session and returns the hosted payment URL.
// The frontend redirects the user to this URL — no card details handled by us.
// ─────────────────────────────────────────────────────────────────────────────
export const createCheckoutSession = async (req, res) => {
    try {
        const { plan } = req.body
        const userId = req.headers["x-user-id"]

        const selectedPlan = PLANS[plan]
        if (!selectedPlan || !selectedPlan.priceId) {
            return res.status(400).json({ message: "Invalid or non-purchasable plan" })
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price: selectedPlan.priceId,
                    quantity: 1
                }
            ],
            mode: "payment",
            // Stripe redirects user here after payment
            success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment/cancelled`,
            // Attach userId so webhook can identify the user
            metadata: {
                userId,
                plan: selectedPlan.id,
                credits: String(selectedPlan.credits)
            }
        })

        // Persist a pending payment record for idempotency tracking
        await Payment.create({
            userId,
            orderId: session.id,           // Stripe Session ID (cs_xxx)
            amount: selectedPlan.amount,
            credits: selectedPlan.credits,
            plan: selectedPlan.id,
            currency: selectedPlan.currency,
            status: "created"
        })

        return res.status(200).json({ url: session.url })

    } catch (error) {
        console.error("[billing/createCheckoutSession]", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}


// ─────────────────────────────────────────────────────────────────────────────
// stripeWebhook
// Stripe calls this endpoint directly after a successful payment.
// MUST receive the raw body (not parsed JSON) to validate signature.
// ─────────────────────────────────────────────────────────────────────────────
export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"]
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event

    try {
        // Validate webhook signature — prevents spoofed events
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
    } catch (err) {
        console.error("[billing/stripeWebhook] Signature verification failed:", err.message)
        return res.status(400).json({ message: `Webhook signature error: ${err.message}` })
    }

    // Only handle successful checkout events
    if (event.type !== "checkout.session.completed") {
        return res.status(200).json({ received: true })
    }

    const session = event.data.object

    try {
        const { userId, plan, credits } = session.metadata

        // Idempotency: find by orderId (Stripe Session ID) and check status
        const payment = await Payment.findOne({ orderId: session.id })

        if (!payment) {
            console.error("[billing/stripeWebhook] Payment record not found for session:", session.id)
            return res.status(404).json({ message: "Payment record not found" })
        }

        // OPT-07: Replay attack prevention — skip if already processed
        if (payment.status === "paid") {
            console.warn("[billing/stripeWebhook] Duplicate webhook received for session:", session.id)
            return res.status(200).json({ received: true })
        }

        // Mark payment as paid atomically
        payment.status = "paid"
        payment.paymentId = session.payment_intent   // Stripe PaymentIntent ID (pi_xxx)
        await payment.save()

        // Notify auth service to upgrade user plan and credit balance
        const internalSecret = process.env.INTERNAL_SECRET || "cortexai-internal-secret-key-2026"
        await axios.post(
            `${process.env.AUTH_SERVICE}/update-plan`,
            { userId, plan, credits: parseInt(credits, 10) },
            { headers: { "x-internal-secret": internalSecret } }
        )

        console.info(`[billing/stripeWebhook] Payment processed for user ${userId}, plan: ${plan}`)
        return res.status(200).json({ received: true })

    } catch (error) {
        console.error("[billing/stripeWebhook] Processing error:", error)
        // Return 500 so Stripe retries the webhook delivery
        return res.status(500).json({ message: "Webhook processing failed" })
    }
}