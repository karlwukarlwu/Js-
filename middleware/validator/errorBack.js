const {validationResult} = require('express-validator');
module.exports = validator => {
    return async (req, res, next) => {
        await Promise.all(validator.map(val => val.run(req)))
        //↑这个是他官方给的写法
        //↓这个是我们自己的业务逻辑
        const err = validationResult(req)
        // console.log(err)
        if (!err.isEmpty()) {
            return res.status(401).json({err: err.array()})
        }
        next()//如果验证成功 继续下一步逻辑 不写好像也行
    }
}