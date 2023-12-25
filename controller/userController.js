const jwt = require('jsonwebtoken');
const fs = require('fs');
const {promisify} = require('util')
const {User, Subscribe} = require('../model')
const lodash = require('lodash')

const {createToken} = require('../util/jwt.js')
const {body} = require("express-validator");


const rename = promisify(fs.rename)

exports.register = async (req, res) => {
    console.log(req)

    const userModle = new User(req.body)
    const dbBack = await userModle.save()//保存用户
    console.log(typeof dbBack)
    let user = dbBack.toJSON()
    delete user.password//那个selet:false不起作用 那个是查询的时候不返回密码
    res.status(201).json({user})
}

exports.login = async (req, res) => {

    let dbBack = await User.findOne(req.body)
    if (!dbBack) {
        res.status(402).json({error: "用户名或者密码错误"})
    }
    //封装了
    // dbBack = dbBack.toJSON()
    // console.log(dbBack)
    //
    // let token = jwt.sign(dbBack,'123',)
    // dbBack.token = token
    dbBack = dbBack.toJSON()
    let token = await createToken(dbBack);
    dbBack.token = token
    res.status(200).json(dbBack)


}


exports.update = async (req, res) => {
    // console.log(req.user.userinfo._id)
    let id = req.user.userinfo._id
    let updateData = await User.findByIdAndUpdate(id, req.body, {new: true})
    //返回的是更新前的数据 需要更新后的数据 改第三个参数
    console.log(updateData)
    res.status(202).json({"user": updateData})
}

exports.headimg = async (req, res) => {
    console.log(req.file)
//     {
//   fieldname: 'headimg',
//   originalname: '微服务.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'public/',
//   filename: 'e6fc9b32d68c7f94a28a0ac884874d6c',
//   path: 'public\\e6fc9b32d68c7f94a28a0ac884874d6c',
//   size: 35629
// }
    let fileArr = req.file.originalname.split(".")
    let filetype = fileArr[fileArr.length - 1]
    console.log(filetype)//拿到类型
    //原路径，新路径
    try {
        await rename('./public/' + req.file.filename,
            './public/' + req.file.filename + '.' + filetype)//改名字 remane是被promisify的
        res.status(200).json({filepath: req.file.filename + '.' + filetype})
    } catch (e) {
        res.status(500).json({error: e})
    }

}

exports.list = async (req, res) => {
    console.log(req)
    res.send('/user-list')
}

exports.delete = async (req, res) => {

}

//用户关注 通过url/:channelId
exports.subscribe = async (req, res) => {
    // 只要有userinfo 一定是过了token的
    const userId = req.user.userinfo._id
    const channelId = req.params.userId //被关注的人的id 粉丝要+1
    if (userId === channelId) {//不能关注自己
        return res.status(400).json({error: "不能关注自己"})
    }
    console.log("到这里了")
    try { //你要是传入非mongo那种格式的id 会报错


        const record = await Subscribe.findOne(//查找是否已经关注
            {
                user: userId,//找你
                channel: channelId//找被你关注的人
            }
        )
        if (record) {//已经关注了
            return res.status(400).json({error: "已经关注了"})
        } else {
            await new Subscribe({//没有关注,在关注表里面创建一条记录
                user: userId,
                channel: channelId
            }).save()
            const user = await User.findById(channelId)//被关注的人
            user.subscribeCount++//粉丝+1
            await user.save()//改为数据库 一定要保存
            res.status(200).json({userId, channelId})

        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({error: e})
    }

}
//取消关注
exports.unsubscribe = async (req, res) => {
    const userId = req.user.userinfo._id
    const channelId = req.params.userId //被关注的人的id 粉丝要+1
    console.log(userId, channelId)
    if (userId === channelId) {
        return res.status(400).json({error: "不能取消关注自己"})
    }
    try {
        const record = await Subscribe.findOne(//查找是否已经关注
            {
                user: userId,//找你
                channel: channelId//找被你关注的人
            }
        )
        if (!record) {//没有关注
            return res.status(400).json({error: "没有关注"})
        } else {//已经关注了
            await record.deleteOne()//删除关注记录 不要用remove
            const user = await User.findById(channelId)//被关注的人
            user.subscribeCount--//粉丝-1
            await user.save()//改为数据库 一定要保存
            res.status(200).json({userId, channelId})
        }
    } catch (e) {
        console.log(123)
        return res.status(500).json({e})
    }
}

//查看用户信息的关注信息 知道自己是否关注了这个人 从而决定是否显示关注按钮
exports.getuser = async (req, res) => {
    let isSubscribe = false
    try {
        if (req.user) {//因为如果有token 我们会把用户信息放到req里面
            const record = await Subscribe.findOne({
                channel: req.params.userId,
                user: req.user.userinfo._id
            })
            if (record) {
                isSubscribe = true
            }
        }
        const user = await User.findById(req.params.userId)

        let t = lodash.pick(user, [ //lodash 对数据对象进行整理和过滤
            "_id"
            , "username"
            , "image"
            , "subscribeCount"
            , "cover"
            , "channeldes"
        ])
        console.log(t)
        let t2 = {...t, isSubscribe}
        console.log(t2)
        res.status(200).json(t2)
    } catch (e) {
        res.status(500).json({e})
    }
}
//查看这个人关注了多少人
exports.getsubscribe = async (req, res) => {
    try {
        let subscribeList = await Subscribe.find({
            user: req.params.userId
        }).populate("channel")//对应的channel字段 channel字段又ref到了user表
       let newsubscribeList =  lodash.map(subscribeList, (item) => {
            return lodash.pick(item.channel, [
                "_id"
                , "username"
                , "image"
                , "subscribeCount"
                , "cover"
                , "channeldes"
            ])
        })
        res.status(200).json(newsubscribeList)
    } catch (e) {
        res.status(500).json({e})
    }
}
//查看这个人的粉丝
exports.getchannel = async (req, res) => {
    try {
        let channelList = await Subscribe.find({
            channel: req.user.userinfo._id //这个info是token解密出来的 解密完了放到req里面了
        }).populate("user")//对应的channel字段 channel字段又ref到了user表
        let newchannelList =  lodash.map(channelList, (item) => {
            return lodash.pick(item.user, [
                "_id"
                , "username"
                , "image"
                , "subscribeCount"
                , "cover"
                , "channeldes"
            ])
        })
        res.status(200).json(newchannelList)
    } catch (e) {
        res.status(500).json({e})
    }
}
