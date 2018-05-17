var http = require("http"),
    url = require("url"),
    fs = require("fs");
var server1 = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;//->存储的是客户端请求的URL地址中问号传参后面的信息(并且是以对象的键值对方式存储的)

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

    //->API数据接口的处理
    var con = null,
        result = null,
        customId = null,
        customPath = "./json/custom.json";

    //->首先我们把“custom.json”文件中的内容都获取到
    con = fs.readFileSync(customPath, "utf-8");
    con.length === 0 ? con = '[]' : null;//->为了防止我们custom.json中什么都没有,con是一个空字符串,我们会使用JSON.parse转换的时候会报错,我们让其等于'[]'
    con = JSON.parse(con);

    //1)获取所有的客户信息
    if (pathname === "/getList") {
        //->开始按照API文档中的规范准备给客户端返回的数据
        result = {
            code: 1,
            msg: "没有任何的客户信息",
            data: null
        };
        if (con.length > 0) {
            result = {
                code: 0,
                msg: "成功",
                data: con
            };
        }
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }

    //2)根据传递进来的客户ID获取某一个具体的客户信息
    if (pathname === "/getInfo") {
        //->把客户端传递进来的ID获取到
        customId = query["id"];
        result = {
            code: 1,
            msg: "客户不存在",
            data: null
        };
        for (var i = 0; i < con.length; i++) {
            if (con[i]["id"] == customId) {
                result = {
                    code: 0,
                    msg: "成功",
                    data: con[i]
                };
                break;
            }
        }
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }

    //3)根据传递进来的客户ID删除这个客户
    if (pathname === "/removeInfo") {
        customId = query["id"];
        var flag = false;
        for (var i = 0; i < con.length; i++) {
            if (con[i]["id"] == customId) {
                con.splice(i, 1);
                flag = true;
                break;
            }
        }
        result = {
            code: 1,
            msg: "删除失败"
        };
        if (flag) {
            fs.writeFileSync(customPath, JSON.stringify(con), "utf-8");
            result = {
                code: 0,
                msg: "删除成功"
            };
        }
        res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
        res.end(JSON.stringify(result));
        return;
    }



});
server1.listen(81, function () {
    console.log("server is success,listening on 81 port!");
});