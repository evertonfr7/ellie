module.exports = {
  apps : [{
    name: 'ellie',
    script: 'backend/index.js',
    env: {
      NODE_ENV: "development",
      MONGO_URI: process.env.MONGO_URI,
      PORT: process.env.PORT || 80,
    },
    env_production: {
      NODE_ENV: "production",
      MONGO_URI: process.env.MONGO_URI,
      PORT: process.env.PORT || 80,
    }
  }],

  deploy : {
    production : {
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
