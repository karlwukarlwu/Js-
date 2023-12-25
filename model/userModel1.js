const mongoose = require('mongoose');
// 这个就是数据格式层 也就是schema层
// 还是老样子 看文档 文档这么说的
const md5 = require('../util/md5.js')
//用户的数据格式
const baseModel = require('./baseModel.js')
const userSchema=  new mongoose.Schema({
    username: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        set: (val) => { //md5加密
            return md5(val)
        },
        select: false //返回的时候不给用户返回密码

    },
    phone: {
        type: String,
        required: true,

    },
    image: {
        type: String,
        default:null
    },
    //频道封面
    cover: {
        type: String,
        default:null
    },
    //频道描述
    channeldes: {
        type: String,
        default:null
    },

    ...baseModel //es6语法 狂野。。。
})

module.exports= userSchema
