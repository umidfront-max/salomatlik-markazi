require('dotenv').config();
module.exports = {
    apps: [
        {
            name: process.env.SITE_NAME,
            port: process.env.SITE_PORT,
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs'
        }
    ]
}
