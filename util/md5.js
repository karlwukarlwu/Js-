const crypto = require('crypto');
//给密码加密 官方内置模块
// console.log(crypto)

// var d =crypto.createHash("md5").update("手动加密"+"对应密码").digest("hex")
// //手动加密防止撞库 +md5加密
// console.log(d)

module.exports = (password) => {
    return crypto
        .createHash("md5")
        .update("by" + password)
        .digest("hex")
}