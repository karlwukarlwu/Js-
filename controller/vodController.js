var RPCClient = require('@alicloud/pop-core').RPCClient;


//这些代码全部来自于阿里云的官方文档
//这个代码的目的是为了获取阿里云的vod的上传地址和凭证 有了这个地址和凭证jquery才能上传视频
function initVodClient(accessKeyId, accessKeySecret,) {
    var regionId = 'cn-shanghai';   // 点播服务接入地域
    var client = new RPCClient({//填入AccessKey信息
        accessKeyId: accessKeyId,
        accessKeySecret: accessKeySecret,
        endpoint: 'http://vod.' + regionId + '.aliyuncs.com',
        apiVersion: '2017-03-21'
    });

    return client;
}


exports.getvod = async (req, res) => {
    // 请求示例
    let client = initVodClient( // 这里就是传入创建rma账号的id和secret
        '见Ram的key',
        '见Ram的key'
    );

    const vodback = await client.request("CreateUploadVideo", {
        Title: 'test vod',//视频标题
        FileName: 'filename.mp4'//视频源文件名称，必须包含扩展名
    }, {})
    res.status(200).json({vod: vodback})
    //不成功开存储管理
// UploadAddress 上传地址
//     UploadAuth 上传凭证
}

