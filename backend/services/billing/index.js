import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/billing.route.js"

dotenv.config()

const port =process.env.PORT

const app=express()

// OPT-11: Security Headers
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff")
    res.setHeader("X-Frame-Options", "DENY")
    res.setHeader("X-XSS-Protection", "0")
    res.setHeader("Referrer-Policy", "no-referrer-when-downgrade")
    if (process.env.NODE_ENV === "production") {
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    }
    next()
})

// Mount Stripe webhook with express.raw() BEFORE express.json()
// This ensures Stripe signature verification gets the unaltered Buffer body
app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    stripeWebhook
)

// Parse JSON and URL-encoded bodies for create-session and other billing endpoints
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

// Billing API routes
app.use("/", router)
app.get("/",(req,res)=>{
    res.json({message:"hello from billing"})
})

// OPT-17: Ensure DB connection is established before listening
async function startServer() {
    try {
        await connectDb()
        app.listen(port,()=>{
            console.log(`billing started at ${port}`)
        })
    } catch (error) {
        console.error("Failed to connect DB in billing service:", error)
        process.exit(1)
    }
}

startServer()
