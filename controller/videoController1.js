const {Video} = require('../model/index.js')

//分页 前端get请求body需要传入 pageNum pageSize
exports.videolist = async (req, res) => {
    let {pageNum = 1, pageSize = 10} = req.body

    // skip 跳过多少条数据
    let videolist = await Video.find()
                    .skip((pageNum - 1) * pageSize)
                    .limit(pageSize)
                    .sort({createdAt: -1})//排序
                    .populate("user","_id username cover")//关联查询
    // {
    //             "_id": "658617fcb1e0e293ec4aff06",
    //             "title": "title",
    //             "vodvideoId": "234234231",
    //             "user": { 直接把user的信息也查出来了
    //                 "_id": "6585d9042b1e11387fcd04db",
    //                 "username": "abc",
    //                 "email": "abc@123.com",
    //                 "phone": "123321",
    //                 "image": "82a4553eae2b922af281a1e959ee676f.jpg",
    //                 "cover": null,
    //                 "channeldes": "klaka",
    //                 "createAt": "2023-12-22T18:44:20.419Z",
    //                 "updateAt": "2023-12-22T18:44:20.419Z",
    //                 "__v": 0
    //             },
    //             "createAt": "2023-12-22T23:13:00.066Z",
    //             "updateAt": "2023-12-22T23:13:00.066Z",
    //             "__v": 0
    //         },
    let getvideoCount = await Video.countDocuments()//总条数
    res.status(200).json({
        videolist,getvideoCount
    })
}
//查询视频详情
exports.video = async (req, res) => {
    // console.log(req.params)
    let {videoId} = req.params
    let video = await Video //找到具体的视频
        .findById(videoId)
        .populate("user","_id username cover")//关联查询

    res.status(200).json({
        video
    })

}

//假设视频只需要前端传入
// {
//     "title":"title",
//     "vodvideoId":"234234234"
// }
exports.createvideo = async (req, res) => {
    var body = req.body
    body.user = req.user.userinfo._id
    console.log(body, "body")
    console.log("...........")
    const videoModel = new Video(body)
    try {
        var dbback = await videoModel.save()
        res.status(200).json({
            dbback
        })
    } catch (e) {
        res.status(500).json({
            err: e
        })
    }


}