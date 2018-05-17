var http = require("http"),
    url = require("url"),
    fs = require("fs");

//->创建一个服务
var server1 = http.createServer(function (req, res) {
    //->解析客户端请求地址中的文件目录名称以及传递给当前服务器的数据内容
    var urlObj = url.parse(req.url, true),
        pathname = urlObj["pathname"],
        query = urlObj["query"];

    //->如果客户端请求的资源文件不存在,我们不加TRY CATCH服务会终止,这样不好,所以我们添加TRY CATCH捕获异常信息,这样即使不存在,服务也不会报错,同样也不会终止
    try {
        var con = fs.readFileSync("." + pathname, "utf-8");
        res.end(con);
    } catch (e) {
        res.end("request file is not find~");
    }
});
//->为当前的这个服务配置端口
server1.listen(1234, function () {
    console.log("server is success,listening on 1234 port!");
});