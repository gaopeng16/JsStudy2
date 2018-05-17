var http = require("http"),
    url = require("url"),
    fs = require("fs");
var server1 = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true),
        pathname = urlObj["pathname"],
        query = urlObj["query"];

    //处理静态资源文件的请求
    var reg = /\.(HTML|JS|CSS|JSON|TXT|ICO|JPG|GIF|PNG|JPEG|BMP)$/i;
    if (reg.test(pathname)) {
        //获取请求的后缀名
        var suffix = reg.exec(pathname)[1].toUpperCase();
        //根据请求文件的后缀名，货到到当前文件的MIME类型
        var suffixMIME = "text/plain";
        switch (suffix) {
            case "HTML":
                suffixMIME = "text/html";
                break;
            case "CSS":
                suffixMIME = "text/css";
                break;
            case "JS":
                suffixMIME = "text/javascript";
                break;
            case "JSON":
                suffixMIME = "application/json";
                break;
            case "ICO":
                suffixMIME = "application/octet-stream";
                break;
        }

        try {
            var conFile = fs.readFileSync("." + pathname, "utf-8");
            res.writeHead(200, {'content-type': suffixMIME + 'charset=utf-8'});
            res.end(conFile);
        } catch (e) {
            res.writeHead(404, {'content-type': 'text/plain;charset=utf-8'});
            res.end("request file is not find~");
        }
    }
});
server1.listen(1234, function () {
    console.log("server is success,listening on 1234 port!");
});