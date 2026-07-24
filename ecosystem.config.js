module.exports = {
  apps: [
    {
      name: "storybizz-next",
      script: "node_modules/.bin/next",
      args: "start -p 3001",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 2000,
    },
  ],
};
