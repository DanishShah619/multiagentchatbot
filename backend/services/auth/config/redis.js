import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

redis.on("connect", () => {
    console.log("Redis connected in Auth Service")
})

redis.on("error", (err) => {
    console.error("[Redis Error - Auth Service]", err.message)
})

export default redis
