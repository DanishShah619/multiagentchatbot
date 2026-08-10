import express from "express"
import { deductCredits, login, logOut, refundCredits, updateUserPayment } from "../controllers/auth.controller.js"

const router=express.Router()

const verifyInternalSecret = (req, res, next) => {
    const internalSecret = req.headers["x-internal-secret"]
    const expectedSecret = process.env.INTERNAL_SECRET || "cortexai-internal-secret-key-2026"
    if (!internalSecret || internalSecret !== expectedSecret) {
        return res.status(403).json({ message: "Forbidden: Internal service access only" })
    }
    next()
}

router.post("/login",login)
router.get("/logout",logOut)
router.post("/update-plan",verifyInternalSecret,updateUserPayment)
router.post("/deduct-credits",verifyInternalSecret,deductCredits)
router.post("/refund-credits",verifyInternalSecret,refundCredits)
export default router