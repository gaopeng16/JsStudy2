var http = require("http"), fs = require("fs"), url = require("url");

var server = http.createServer(function (request, response) {
    //当客户端向服务端当前服务发送一个请求，并且当前服务成功接收到这个请求后执行这个回调函数
    //request:存放的是所有客户端的请求信息
    //responses:提供了服务器端向客户端返回内容和数据的方法

    response.end();
});

server.listen(80, function () {
    //当端口号监听成功之后执行
    console.log("ok");
});