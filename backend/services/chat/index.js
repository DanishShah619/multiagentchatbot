import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import router from "./routes/chat.routes.js"

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

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use("/",router)
app.get("/",(req,res)=>{
    res.json({message:"hello from chat"})
})

// OPT-17: Ensure DB connection is established before listening
async function startServer() {
    try {
        await connectDb()
        app.listen(port,()=>{
            console.log(`chat started at ${port}`)
        })
    } catch (error) {
        console.error("Failed to connect DB in chat service:", error)
        process.exit(1)
    }
}

startServer()
