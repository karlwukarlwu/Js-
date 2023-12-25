const mongoose = require('mongoose');

const baseModel = require('./baseModel.js')

//视频的图片数据格式 视频和用户的关系
//增加了一个视频的评论
//增加了一个视频的点赞的逻辑
const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: false,
    },
    vodvideoId: { //和阿里云的视频id对应, 实际上拿不到 应该是前端自己生成
        // 阿里云只能拿到视频的url
        type: String,
        required: true,
    },
    user: {  //和用户id对应 mongoDB的id
        type: mongoose.ObjectId,
        required: true,
        ref: 'User' //这里的user是指向userModel的
    },
    cover: {
        type: String,
        required: false,
    },
    commentCount: {
        type: Number,
        default: 0
    },
    likeCount: {
        type: Number,
        default: 0
    },
    dislikeCount: {
        type: Number,
        default: 0
    },
    ...baseModel //es6语法 狂野。。。
})

module.exports = videoSchema
