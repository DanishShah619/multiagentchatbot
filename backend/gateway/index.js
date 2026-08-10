import express from "express"
import dotenv from "dotenv"
import proxy from "express-http-proxy"
dotenv.config()
import cors from "cors"
import cookieParser from "cookie-parser"
import { rateLimit } from "express-rate-limit"
import { getCurrentUser } from "./controllers/user.controller.js"
import protect from "./middleware/auth.middleware.js"
import { proxyWithHeader } from "./utils/proxyWithHeader.js"
import morgan from "morgan"

// SEC-06: Per-route rate limiters
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." }
})

const billingLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,  // 1 hour
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many billing requests, please try again later." }
})

const agentLimiter = rateLimit({
    windowMs: 60 * 1000,        // 1 minute
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too many requests, please slow down." }
})
const port =process.env.PORT

const app=express()

// OPT-11: Security Headers Middleware (OWASP Standard)
app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff")
    res.setHeader("X-Frame-Options", "DENY")
    res.setHeader("X-XSS-Protection", "0")
    res.setHeader("Referrer-Policy", "no-referrer-when-downgrade")
    res.setHeader("X-Permitted-Cross-Domain-Policies", "none")
    if (process.env.NODE_ENV === "production") {
        res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    }
    next()
})

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(morgan("dev"))
app.use(cookieParser())
// SEC-03: Block public access to all internal-only auth endpoints
app.use(["/api/auth/update-plan", "/api/auth/deduct-credits", "/api/auth/refund-credits"], (req, res) => {
    return res.status(403).json({ message: "Forbidden: Internal route" })
})
app.use("/api/auth",authLimiter,proxy(process.env.AUTH_SERVICE))
app.use("/api/chat",protect,proxyWithHeader(process.env.CHAT_SERVICE))
app.use("/api/agent",protect,agentLimiter,proxyWithHeader(process.env.AGENT_SERVICE))
app.use("/api/billing",protect,billingLimiter,proxyWithHeader(process.env.BILLING_SERVICE))
app.get("/api/me",protect,getCurrentUser)
app.get("/",(req,res)=>{
    res.json({message:"hello from gateway v5"})
})

app.listen(port,()=>{
    console.log(`gateway started at ${port}`)
})
