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
            res.writeHead(200, {'content-type': suffixMIME + ';charset=utf-8;'});
            res.end(conFile);
        } catch (e) {
            res.writeHead(404, {'content-type': 'text/plain;charset=utf-8'});
            res.end("request file is not find~");
        }
        return;
    }
    //API数据接口的处理
    var con = null,
        result = null,
        customId = null,
        customPath = "./json/custom.json";

    //获取数据
    con = fs.readFileSync(customPath, "utf-8");
    con.length === 0 ? con = '[]' : null;
    con = JSON.parse(con);

    //获取所有的客户信息
    if (pathname === "/getList") {
        result = {
            code: 1,
            msg: "没有任何客户信息",
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

    //获取某一个给定ID的客户信息
    if (pathname === "/getInfo") {
        customId = query.id;
        result = {
            code: 1,
            msg: "前客户不存在",
            data: null
        };
        for (var i = 0; i < con.length; i++) {
            if (con[i].id == customId) {
                // console.log(con[i]);
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

    //删除某一个给定ID的客户信息
    if (pathname === "/removeInfo") {
        customId = query.id;
        console.log(query);
        var flag = false;
        for (var i = 0; i < con.length; i++) {
            if (con[i].id == customId) {
                con.splice[i, 1];
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

    //添加客户信息
    if (pathname === "/addInfo") {
        var str = '';
        req.on("data", function (chunk) {
            str += chunk;
        });

        req.on("end", function () {
            if (str.length === 0) {
                result = {
                    code: 1,
                    msg: "增加失败"
                };
                return;
            }
            var data = JSON.parse(str);
            data["id"] = con.length === 0 ? 1 : parseFloat(con[con.length - 1]["id"]) + 1;
            con.push(data);
            fs.writeFileSync(customPath, JSON.stringify(con), "utf-8");
            res.end(JSON.stringify({
                code: 0,
                msg: "添加成功!"
            }))
        });
        return;
    }

    //修改客户信息
    if (pathname === "/updateInfo") {
        var str = '';
        req.on("data", function (chunk) {
            str += chunk;
        });
        req.on("end", function () {
            if (str.length === 0) {
                res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
                res.end(JSON.stringify({
                    code: 1,
                    msg: "修改失败"
                }));
                return;
            }
        });
        var flag = false,
            data = JSON.parse(str);
        for (var i = 0; i < con.length; i++) {
            if (con[i]["id"] == data["id"]) {
                con[i] = data;
                flag = true;
                break;
            }
        }
        if (flag) {
            result = {
                code: 1,
                msg: "修改成功"
            };
        }
        fs.writeFileSync(customPath, JSON.stringify(con), "utf-8");
        res.end(JSON.stringify(result));
        return;
    }

    res.writeHead(404, {'content-type': 'text/plain;charset=utf-8;'});
    res.end("请求的数据接口不存在");

});
server1.listen(1234, function () {
    console.log("server is success,listening on 1234 port!");
});