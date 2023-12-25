const mongoose = require('mongoose');
console.log(123)
const {mongopath}= require("../config/config.default.js")

//提取配置文件
async function connect() {
    await mongoose.connect(mongopath)
    //返回的是一个空的promise
}

connect().then((res) => {
    console.log('Connected!')

}).catch((err) => {
    console.log(err);
    console.log('Failed to connect!')
})
//index仅作为入口文件，连接数据库，只负责导入其他文件

//这里集中导出我们设计好的模型,同时在数据库中创建了对应的集合，会自动给集合名加s
module.exports = {
    User:mongoose.model('User',require('./userModel.js')),
    Video:mongoose.model('Video',require('./videoModel.js')),
    Subscribe:mongoose.model('Subscribe',require('./subscribeModel.js')),
    VideoComment:mongoose.model('VideoComment',require('./videocommentModel.js')),
    VideoLike:mongoose.model('VideoLike',require('./videolikeModel.js')),
    CollectModel:mongoose.model('CollectModel',require('./colletcModel.js')),

}