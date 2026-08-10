import proxy from "express-http-proxy"

export const proxyWithHeader = (serviceUrl) => {
    return proxy(serviceUrl, {
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            // OPT-06: Sanitize client headers to prevent header spoofing
            delete proxyReqOpts.headers["x-user-id"]
            delete proxyReqOpts.headers["x-internal-secret"]

            if (srcReq.user) {
                proxyReqOpts.headers["x-user-id"] = srcReq.user.userId
                proxyReqOpts.headers["x-user-email"] = srcReq.user.email || ""
            }
            return proxyReqOpts
        }
    })
}