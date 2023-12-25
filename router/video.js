const express = require('express')
const router = express.Router()
const videoController = require('../controller/videoController.js')
const vodController = require('../controller/vodController.js')
const {verifyToken} = require("../util/jwt");
const {videoValidator} = require("../middleware/validator/videoValidator");

//添加了收藏的路由
//热门推荐的路由

router
    .get("/gethots/:topnum"//热门推荐
        , videoController.getHots)
    .get("/collect/:videoId"//收藏视频"
        , verifyToken()
        , videoController.collect)
    .get("/likelist"//获取点赞列表
        , verifyToken()
        , videoController.likelist)
    .get("/dislike/:videoId"//点踩视频"
        , verifyToken()
        , videoController.dislikevideo)
    .get("/like/:videoId"//点赞视频
        , verifyToken()
        , videoController.likevideo)
    .delete("/comment/:videoId/:commentId"//删除视频的评论
        , verifyToken()
        , videoController.deletecomment)
    .get("/commentlist/:videoId",//看视频评论 不需要登录
        videoController.commentlist)
    .post("/comment/:videoId"//评论
        , verifyToken()
        , videoController.comment)
    .get("/videolists"//获取视频列表 这里有分页
        , videoController.videolist)
    .get("/video/:videoId"//获取视频 区分登录和未登录
        , verifyToken(false)
        , videoController.video)
    .get("/getvod"//拿到发视频的凭证
        , verifyToken()
        , vodController.getvod) //前端要是用jquery测试把token关了
    //下面这个post应该是前端发过来的 但是因为没有前端 所以这个连接的逻辑是我们用post手动复制粘贴给postman 然后录入数据库的
    .post("/createvideo"
        , verifyToken()//这个是验证token的
        , videoValidator//这个是验证video的格式的
        , videoController.createvideo)//将视频信息写入数据库，


module.exports = router
