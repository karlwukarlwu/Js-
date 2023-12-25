//用户和关注者之家的关系

const mongoose = require('mongoose');
const baseModel = require('./baseModel.js')

const subscribeSchema = new mongoose.Schema({
    user: {  //和用户id对应 mongoDB的id
        type: mongoose.ObjectId,
        required: true,
        ref: 'User' //被订阅者
    },
    channel: {  //和用户id对应 mongoDB的id
        type: mongoose.ObjectId,
        required: true,
        ref: 'User' //订阅者
    },
    ...baseModel //es6语法 狂野。。。
})

module.exports = subscribeSchema