const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const router = require('./router')//默认找index.js

app.use(express.json())//处理json格式的请求体
app.use(express.urlencoded({extended: true}))//处理表单格式的请求体

// 解决跨域问题
app.use(cors())
// 日志
app.use(morgan('dev'))//看手册，一般都这么写
// 静态文件 以后所有的静态资源可以通过url获取
app.use(express.static('public'))//静态文件中间件

app.use("/api/v1",router)//挂载路由


 
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
