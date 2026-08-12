module.exports = {
  apps: [
    {
      name: "cortex-gateway",
      script: "./backend/gateway/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "cortex-auth",
      script: "./backend/services/auth/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "cortex-chat",
      script: "./backend/services/chat/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "cortex-agent",
      script: "./backend/services/agent/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "cortex-billing",
      script: "./backend/services/billing/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}
