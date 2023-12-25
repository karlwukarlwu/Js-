const {redis} = require('./index.js');
//视频id 和 要让视频热度增加多少
exports.hotInc = async (videoId, incNum) => {
    var data = await redis.zscore('videohots', videoId)
    var inc = null
    console.log(data, "data")
    console.log(incNum, "incNum")
    console.log(videoId, "videoId")
    if (data) {
        console.log(data, "data")
        inc = await redis.zincrby('videohots', incNum, videoId)//有增长
    } else {
        console.log("没有")
        //这一步创建数据库
        inc = await redis.zadd('videohots', incNum, videoId)//没有创建

    }
    return inc
}

exports.topHots = async (num) => {
    var paixu = await redis.zrevrange('videohots', 0, num - 1, 'WITHSCORES')//想获取前num个视频的id和热度
    var newarr = paixu.slice(0, num * 2)
    var obj = {}
    for (let i = 0; i < newarr.length; i++) {
       if (i%2===0){
           obj[newarr[i]]=newarr[i+1]
       }
    }
    return obj
}
