import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    // orderId is now the Stripe Checkout Session ID (cs_xxxx)
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    // paymentId is the Stripe PaymentIntent ID (pi_xxxx)
    paymentId: {
        type: String,
        index: true
    },
    amount: Number,
    currency: {
        type: String,
        default: "usd"
    },
    credits: {
        type: Number
    },
    plan: {
        type: String
    },
    status: {
        type: String,
        enum: ["created", "paid", "failed"],
        default: "created"
    }
}, { timestamps: true })

const Payment = mongoose.model("Payment", paymentSchema)
export default Payment