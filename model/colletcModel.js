const mongoose = require('mongoose');
const baseModel = require('./baseModel.js')


const collectSchema = new mongoose.Schema({
    user: {//用户
        type: mongoose.ObjectId,
        required: true,
        ref: 'User' //被订阅者
    },
    video: {  //收藏视频
        type: mongoose.ObjectId,
        required: true,
        ref: 'Video' //订阅者
    },

    ...baseModel //es6语法 狂野。。。
})

module.exports = collectSchema