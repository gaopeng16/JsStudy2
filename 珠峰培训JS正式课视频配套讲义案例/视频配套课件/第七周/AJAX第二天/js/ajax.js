//->createXHR:创建AJAX对象,兼容所有的浏览器
function createXHR() {
    var xhr = null,
        flag = false,
        ary = [
            function () {
                return new XMLHttpRequest;
            },
            function () {
                return new ActiveXObject("Microsoft.XMLHTTP");
            },
            function () {
                return new ActiveXObject("Msxml2.XMLHTTP");
            },
            function () {
                return new ActiveXObject("Msxml3.XMLHTTP");
            }
        ];
    for (var i = 0, len = ary.length; i < len; i++) {
        var curFn = ary[i];
        try {
            xhr = curFn();
            createXHR = curFn;
            flag = true;
            break;
        } catch (e) {
        }
    }
    if (!flag) {
        throw new Error("your browser is not support ajax,please change your browser,try again!");
    }
    return xhr;
}








