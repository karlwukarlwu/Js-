const express = require('express')

const router = express.Router()


// 简写了
router.use('/video', require('./video.js'))//挂载路由 并且加上前缀 以后的网站都是/video开头的
router.use("/user", require('./user.js'))//挂载路由 并且加上前缀 以后的网站都是/video开头的
module.exports = router
