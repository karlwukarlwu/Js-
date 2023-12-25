const jwt = require('jsonwebtoken');
const {promisify} = require('util')
const tojwt = promisify(jwt.sign)
const {uuid} = require("../config/config.default.js")

module.exports.verifyToken = async (req, res, next) => {

    let token = req.headers.authorization
    token = token ? token.split(" ")[1] : null
    console.log(token)
    if (!token) {
        return res.status(401).json({error: "没有token"})
    }
    try {//token过期 或者token不正确
        let userinfo = await jwt.verify(token, uuid)//解密 密码是你之前加密的
        // console.log(userinfo,"userinfo")
        req.user = userinfo//把解密的数据放到req里面
        console.log(userinfo, "userinfo")
        console.log(req.user, "req.user jwt")
        next()
    } catch (e) {
        console.log(e)
        return res.status(401).json({error: "token不正确"})
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


//
// const token = jwt.sign({foo:'bar'},'555');
// console.log(token);
// const decoded = jwt.verify(token,'555');
// console.log(decoded);
//{ foo: 'bar', iat: 1703235989 } iat是时间戳