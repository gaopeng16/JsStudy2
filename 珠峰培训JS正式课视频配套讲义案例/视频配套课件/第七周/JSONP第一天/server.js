var http = require("http"),
    url = require("url"),
    fs = require("fs");
var server1 = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;

    //->静态资源文件请求的处理
    var reg = /\.(HTML|CSS|JS|ICO)/i;
    if (reg.test(pathname)) {
        var suffix = reg.exec(pathname)[1].toUpperCase();
        var suffixMIME = "text/html";
        switch (suffix) {
            case "CSS":
                suffixMIME = "text/css";
                break;
            case "JS":
                suffixMIME = "text/javascript";
                break;
        }
        try {
            var conFile = fs.readFileSync("." + pathname, "utf-8");
            res.writeHead(200, {'content-type': suffixMIME + ';charset=utf-8;'});
            res.end(conFile);
        } catch (e) {
            res.writeHead(404, {'content-type': 'text/plain;charset=utf-8;'});
            res.end("file is not found~");
        }
        return;
    }

    //->JSONP的处理
    if (pathname === "/getAll") {
        //->接收客户端传递进来的函数名
        var fnName = query["cb"];

        //->准备数据
        var con = fs.readFileSync("./custom.json", "utf-8");
        con = "a,b";

        //->返回给客户端内容
        res.writeHead(200, {'content-type': 'text/javascript;charset=utf-8;'});
        res.end(fnName + '(' + con + ',100)');
    }
});
server1.listen(81, function () {
    console.log("server is success,listening on 81 port!");
});