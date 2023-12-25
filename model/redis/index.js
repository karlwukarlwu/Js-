const Redis = require('ioredis');
const {redisClient} = require('../../config/config.default.js')
const redis = new Redis(redisClient.port, redisClient.path, redisClient.options)

//reids的配置
redis.on('error', err => {
        if (err) {
            console.log('redis error', err)
            redis.quit()
        }
    }
)
redis.on("ready", () => {
        console.log("redis ready")
    }
)

exports.redis = redis