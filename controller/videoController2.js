const {Video} = require('../model/index.js')
const {VideoComment} = require("../model");
const {VideoLike} = require("../model");

exports.videolist = async (req, res) => {
    let {pageNum = 1, pageSize = 10} = req.body
    let videolist = await Video.find()
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .sort({createdAt: -1})//排序
        .populate("user", "_id username cover")//关联查询

    let getvideoCount = await Video.countDocuments()//总条数
    res.status(200).json({
        videolist, getvideoCount
    })
}

//获取视频详情
exports.video = async (req, res) => {

    let {videoId} = req.params
    let videoInfo = await Video //找到具体的视频
        .findById(videoId)
        .populate("user", "_id username cover")//关联查询

    res.status(200).json({
        videoInfo
    })

}


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

//视频评论 评论的视频从url中获取 评论的内容从body中获取
exports.comment = async (req, res) => {
    let {videoId} = req.params
    let {content} = req.body
    try {

        let videoInfo = await Video.findById(videoId)
        if (!videoInfo) {
            return res.status(404).json({
                err: "视频不存在"
            })
        }
        const comment = await new VideoComment({
            content,
            video: videoId,
            user: req.user.userinfo._id
        }).save()
        videoInfo.commentCount++
        await videoInfo.save()
        res.status(201).json(comment)
    } catch (e) {
        res.status(500).json(e)
    }
}

//根据视频id 拿到所有视频的评论
exports.commentlist = async (req, res) => {
    const video = req.params.videoId
    let {pageNum = 1, pageSize = 10} = req.body
    const comments = await VideoComment.find({video})
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .sort({createdAt: -1})//排序
        .populate("user", "_id username image")//关联查询
    const commentCount = await VideoComment.countDocuments({video})
    res.status(200).json({
        comments, commentCount
    })
}

//删除视频的评论
exports.deletecomment = async (req, res) => {
    let {videoId, commentId} = req.params
    try {
        let videoInfo = await Video.findById(videoId)
        if (!videoInfo) {
            return res.status(404).json({
                err: "视频不存在"
            })
        }
        const comment = await VideoComment.findById(commentId)
        if (!comment) {
            return res.status(404).json({
                err: "评论不存在"
            })
        }
        if (!(comment.user.equals(req.user.userinfo._id))) {
            return res.status(403).json({
                err: "没有权限"
            })
        }
        await comment.deleteOne()
        videoInfo.commentCount--
        await videoInfo.save()
        res.status(200).json({
            success: true
        })
    } catch (e) {
        res.status(500).json(e)
    }
}

//点赞视频
//假设你默认喜欢这些视频
//如果你点过 那么再点就是取消点赞
//如果你没点过 那么再点就是点赞
//如果你点过 而且是点踩 那么再点就是取消点踩 点赞
exports.likevideo = async (req, res) => {
    let {videoId} = req.params
    console.log(videoId, "videoId")
    const userId = req.user.userinfo._id
    console.log(userId, "userId")
    try {
        //先找到视频,看看视频是否存在
        let video = await Video.findById(videoId)
        if (!video) {
            return res.status(404).json({
                err: "视频不存在"
            })
        }
        //视频存在 但是你点过吗 找你和视频的关系
        //如果你点过 那么再点就是取消点赞
        // 如果你没点过 那么再点就是点赞
        let doc = await VideoLike.findOne({
            user: userId,
            video: videoId
        })
        console.log(doc, "doc")
        //默认你喜欢这个视频
        let isLike = true
        //找到了 看你是喜欢还是不喜欢

        //     如果点过 且点赞了 那么取消点赞
        if (doc && doc.like === 1) {
            console.log("取消点赞")
            await doc.deleteOne()
            //设置点赞状态为false
            isLike = false
            // (因为他还有一个单独的点踩的函数 所以这里可以执行)
            //     如果点过 且点踩了 那么取消点踩 点赞
        } else if (doc && doc.like === -1) {
            console.log("点赞")
            doc.like = 1
            await doc.save()
            //     如果没点过 那么点赞
        } else {
            console.log("初始化 null 点赞")
            await new VideoLike({
                user: userId,
                video: videoId,
                like: 1
            }).save()
        }
        //这个点赞数和点踩数是刚刚加到那个model里面的
        //统计like表的指定video的总点赞数 然后再更新到video表里面
        //点赞数
        video.likeCount = await VideoLike.countDocuments({video: videoId, like: 1})

        //点踩数
        video.dislikeCount = await VideoLike.countDocuments({video: videoId, like: -1})

        await video.save()
        console.log(video)
        res.status(200).json({
           ...video.toJSON()//先转换为json对象再解构
            , isLike
        })
    } catch (e) {
        res.status(500).json(e)
    }
}

exports.dislikevideo = async (req, res) => {
    let {videoId} = req.params
    console.log(videoId, "videoId")
    const userId = req.user.userinfo._id
    console.log(userId, "userId")
    try {

        let video = await Video.findById(videoId)
        if (!video) {
            return res.status(404).json({
                err: "视频不存在"
            })
        }
        let isdisLike = true
        let doc = await VideoLike.findOne({
            user: userId,
            video: videoId
        })

        if (doc && doc.like === -1) {
            console.log("取消点踩")
            await doc.deleteOne()
            isdisLike = false
        } else if (doc && doc.like === 1) {
            console.log("点踩")
            doc.like = -1
            await doc.save()
        } else {
            console.log("初始化 null 点踩")
            await new VideoLike({
                user: userId,
                video: videoId,
                like: -1
            }).save()
        }
        video.likeCount = await VideoLike.countDocuments({video: videoId, like: 1})
        video.dislikeCount = await VideoLike.countDocuments({video: videoId, like: -1})
        await video.save()
        console.log(video)
        res.status(200).json({
            ...video.toJSON(), isdisLike
        })
    }catch (e) {
        res.status(500).json(e)
    }
}

//获取用户的点赞列表
//直接根据token 看你是谁 然后找你的点赞列表
exports.likelist = async (req, res) => {
    let {pageNum = 1, pageSize = 10} = req.body
    let likes = await VideoLike
        .find({
            like: 1
            ,user:req.user.userinfo._id
        })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .sort({createdAt: -1})//排序
        .populate("video", "_id title vodvideoId user")//关联查询 视频信息和上传者
    let getlikeCount = await VideoLike.countDocuments()//总条数
    res.status(200).json(
        {likes, getlikeCount}
    )
}
