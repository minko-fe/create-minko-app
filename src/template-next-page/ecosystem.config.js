module.exports = {
  apps: [
    {
      name: 'template-next-page',
      exec_mode: 'cluster',
      instances: 2,
      script: 'server.js',
      watch: false,
      autorestart: true,
      max_memory_restart: '1G', // depends on YOU
      node_args: '--harmony',
    },
  ],
}
