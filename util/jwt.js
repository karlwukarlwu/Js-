const jwt = require('jsonwebtoken');
const {promisify} = require('util')
const tojwt = promisify(jwt.sign)
const {uuid} = require("../config/config.default.js")

//新版验证token 逻辑区别于老版 默认需要token但是可以手动设置为不需要token，有token更好
module.exports.verifyToken = function (require = true) {


    return async (req, res, next) => {

        let token = req.headers.authorization
        token = token ? token.split(" ")[1] : null
        console.log(token)
        if (token) { //有token 如果require为true 那么没有token就打回 如果require为false 那么没有token也放行 只不过req.user是空的
            try {
                let userinfo = await jwt.verify(token, uuid)
                req.user = userinfo //这个很重要
                // console.log(userinfo, "userinfo")
                // console.log(req.user, "req.user jwt")
                next()
            } catch (e) { //有token 但是是无效的token
                console.log(e)
                return res.status(401).json({error: "token不正确"})
            }
        }else if(require) { //没有token 但是默认需要token
            return res.status(401).json({error: "没有token"})
        }else {//没有token 但是不需要token
            next()
        }
    }
}


module.exports.createToken = async (userinfo) => {
    let token = await tojwt(
        {userinfo},
        uuid,
        {expiresIn: 60 * 60 * 24}//基础单位是秒
    ) //60*60*24是一天
    return token
}


