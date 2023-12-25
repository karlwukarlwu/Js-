const mongoose = require('mongoose');

const baseModel = require('./baseModel.js')

//视频评论的数据结构

const videolikeSchema = new mongoose.Schema({
   user: { //和用户id对应 mongoDB的id
       type: mongoose.ObjectId,
       required: true,
       ref: 'User' //这里的user是指向userModel的
    },
    video: { //和视频id对应 mongoDB的id
        type: mongoose.ObjectId,
        required: true,
        ref: 'Video' //这里的video是指向videoModel的
    },
    like: {
        type: Number,
        enum:[1,-1], //1表示点赞 -1表示点踩
    },
    ...baseModel //es6语法 狂野。。。
})

module.exports = videolikeSchema
