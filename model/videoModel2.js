const mongoose = require('mongoose');

const baseModel = require('./baseModel.js')

//视频的图片数据格式 视频和用户的关系
//增加了一个视频的评论
const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

    },
    description: {
        type: String,
        required: false,
    },
    vodvideoId: { //和阿里云的视频id对应
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
    ...baseModel //es6语法 狂野。。。
})

module.exports = videoSchema
