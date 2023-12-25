//上传头像
const express = require('express')

const router = express.Router()
const userController = require('../controller/userController.js')
const {verifyToken} = require("../util/jwt.js")

const userValidator = require("../middleware/validator/userValidator.js")

const multer = require("multer")
const upload = multer({dest: "public/"}) //以当前项目为根目录

//想要分页去看video.js 那里面有分页
router
    .get("/getchannel/"//看这个人有多少粉丝
        , verifyToken()//只有登录了才能看
        , userController.getchannel)
    .get("/getsubscribe/:userId"//看这个人订阅了谁
        // , verifyToken(false)
        , userController.getsubscribe)
    .get("/getuser/:userId" //看这个人的信息
        , verifyToken(false)
        , userController.getuser)//这个userId是要获取的人的id
    .get("/subscribe/:userId"//这个userId是被订阅的人的id 他的粉丝要+1
        , verifyToken()
        , userController.subscribe)
    .get("/unsubscribe/:userId"//取消订阅
        , verifyToken()
        , userController.unsubscribe)
    .post("/registers"//注册
        , userValidator.register
        , userController.register)
    .post("/logins"//登录
        , userValidator.login
        , userController.login)
    .get("/lists"//测试
        , verifyToken() //以前是verifyToken 现在因为加了一层逻辑 所以要加括号 但是默认是需要 所以括号里面不需要写
        , userController.list)
    .put("/update"
        , verifyToken(), userValidator.update //他的放行在errorback里面
        , userController.update)
    .post("/headimg", verifyToken(), upload.single('headimg'), userController.headimg)
    //要求客户端传的文件名是headimg
    //传进来的名字是一个哈希值
    .delete("/", userController.delete)


module.exports = router