import { getAuth } from "firebase-admin/auth"
import { app } from "../config/firebase.js"
import User from "../models/user.model.js"
import redis from "../config/redis.js"

export const login = async (req, res) => {
    try {
        const { token } = req.body
        const decoded = await getAuth(app).verifyIdToken(token)
        let user = await User.findOne({
            firebaseUid: decoded.uid
        })

        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.picture
            })
        }

        const sessionId = crypto.randomUUID()
        await redis.set(`user-session-${user?._id}`,
            sessionId
            , "EX", 7 * 24 * 60 * 60)
        await redis.set(`session-${sessionId}`, JSON.stringify({
            userId: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            plan: user.plan,
            credits: user.credits,
            totalCredits: user.totalCredits,
            planExpiresAt: user.planExpiresAt
        }), "EX", 7 * 24 * 60 * 60)




        const isProduction = process.env.NODE_ENV === "production"
        const isCrossDomain = isProduction || true // sslip.io to vercel is cross-site

        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json(user)

    } catch (error) {
        console.error("[auth/login]", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}


export const logOut = async (req, res) => {
    try {
        const sessionId = req.cookies?.session
        if (sessionId) {
            await redis.del(`session-${sessionId}`)
        }
        // SEC-05: Pass matching options to ensure browsers honor clearance
        res.clearCookie("session", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })
        return res.status(200).json({ message: "logout successfully" })
    } catch (error) {
        console.error("[auth/logout]", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}


export const updateUserPayment = async (req, res) => {
    try {
        const { plan, credits, userId } = req.body
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        user.plan = plan
        user.credits += credits
        user.totalCredits += credits
        user.planExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        await user.save()

        const sessionId = await redis.get(`user-session-${user?._id}`)
        if (sessionId) {
            await redis.set(`session-${sessionId}`, JSON.stringify({
                userId: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                plan: user.plan,
                credits: user.credits,
                totalCredits: user.totalCredits,
                planExpiresAt: user.planExpiresAt
            }), "EX", 7 * 24 * 60 * 60)
        }

        return res.status(200).json({ success: true })

    } catch (error) {
        console.error("[auth/updateUserPayment]", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}


export const deductCredits = async (req, res) => {
    try {
        const { userId, agent } = req.body
        
        const COST = {
            chat: 1,
            search: 5,
            coding: 10,
            pdf: 10,
            ppt: 10,
            vision: 10,
            pdfrag: 10,
            imageanalyzer: 10
        };

        const agentKey = String(agent || "").toLowerCase();
        // SEC-12: Reject unknown/unsupported agent types instead of defaulting to 1 credit
        if (!COST[agentKey]) {
            return res.status(400).json({ message: "Invalid or unsupported agent type" })
        }

        const requiredCredits = COST[agentKey]

        // SEC-04: Atomic update to prevent race conditions (TOCTOU overdraw)
        const user = await User.findOneAndUpdate(
            { _id: userId, credits: { $gte: requiredCredits } },
            { $inc: { credits: -requiredCredits } },
            { new: true }
        )

        if (!user) {
            return res.status(400).json({ message: "Insufficient credits or user not found" })
        }

        const sessionId = await redis.get(`user-session-${user._id}`)
        if (sessionId) {
            await redis.set(`session-${sessionId}`, JSON.stringify({
                userId: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                plan: user.plan,
                credits: user.credits,
                totalCredits: user.totalCredits,
                planExpiresAt: user.planExpiresAt
            }), "EX", 7 * 24 * 60 * 60)
        }

        return res.status(200).json({ success: true, credits: user.credits })
    } catch (error) {
        console.error("[auth/deductCredits]", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const refundCredits = async (req, res) => {
    try {
        const { userId, agent } = req.body
        const COST = {
            chat: 1, search: 5, coding: 10, pdf: 10, ppt: 10, vision: 10, pdfrag: 10, imageanalyzer: 10
        };
        const agentKey = String(agent || "").toLowerCase()

        // SEC-12: Reject unknown agent types — do not silently default
        if (!COST[agentKey]) {
            return res.status(400).json({ message: "Invalid or unsupported agent type" })
        }
        const refundAmount = COST[agentKey]

        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { credits: refundAmount } },
            { new: true }
        )

        if (user) {
            const sessionId = await redis.get(`user-session-${user._id}`)
            if (sessionId) {
                await redis.set(`session-${sessionId}`, JSON.stringify({
                    userId: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    plan: user.plan,
                    credits: user.credits,
                    totalCredits: user.totalCredits,
                    planExpiresAt: user.planExpiresAt
                }), "EX", 7 * 24 * 60 * 60)
            }
        }

        return res.status(200).json({ success: true, credits: user?.credits })
    } catch (error) {
        console.error("[auth/refundCredits]", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}