const {body} = require("express-validator")

const validator = require("../validator/errorBack.js")
const {User} = require("../../model/index")


module.exports.register =validator( [
    body("username").notEmpty().withMessage("用户名不能为空").bail()
        .isLength({min:3}).withMessage("用户名不能少于3个字符").bail(),
    body("email").notEmpty().withMessage("密码不能为空").bail()
        .isEmail().withMessage("邮箱格式不正确").bail()
        .custom(async (email)=>{
            const emailValidate = await User.findOne({email})
            if(emailValidate){
                return Promise.reject("邮箱已经被注册了")
            }
        }).bail(),
    body("phone").notEmpty().withMessage("手机号不能为空").bail()
        .custom(async (phone)=>{
            const phoneValidate = await User.findOne({phone})
            if(phoneValidate){
                return Promise.reject("手机号已经被注册了")
            }
        }).bail(),
    body("password").notEmpty().withMessage("密码不能为空").bail()
        .isLength({min:3,max:16}).withMessage("密码长度必须在3-16位之间").bail(),

])

//邮箱+密码
module.exports.login = validator([
    body("email").notEmpty().withMessage("邮箱不能为空").bail()
        .isEmail().withMessage("邮箱格式不正确").bail()
        .custom(async (email)=>{
            const emailValidate = await User.findOne({email})
            if(!emailValidate){
                return Promise.reject("用户不存在")
            }
        }).bail()
    ,body("password").notEmpty().withMessage("密码不能为空").bail()
        .isLength({min:3,max:16}).withMessage("密码长度必须在3-16位之间").bail()
])

//用户的修改验证 邮箱 用户名 手机号 要求修改的内容不能和数据库中的内容重复
module.exports.update = validator([
    body("email")
    .custom(async val=>{
        const emailValidate = await User.findOne({email:val})
        if(emailValidate){
            return Promise.reject("邮箱已注册")
        }
    }).bail()
    ,body("username")
        .custom(async val=>{
            const unameValidate = await User.findOne({username:val})
            if(unameValidate){
                return Promise.reject("用户名已注册")
            }
        }).bail()
    ,body("phone")
        .custom(async val=> {
            const phoneValidate = await User.findOne({phone: val})
            if (phoneValidate) {
                return Promise.reject("手机号已注册")
            }
        }).bail()

])