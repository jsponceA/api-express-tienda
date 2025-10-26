module.exports = {
  apps: [{
    name: "api-express-tienda",
    script: "src/index.js",
    instances: 2,
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: 3003,
    },
    error_file: "logs/err.log",
    out_file: "logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    merge_logs: true,
    autorestart: true,
    max_memory_restart: "500M",
    watch: false,
    ignore_watch: ["node_modules", "logs"],
  }],
};
