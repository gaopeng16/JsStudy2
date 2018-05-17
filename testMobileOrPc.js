~function () {
    var reg1 = /AppleWebkit.*Mobile/i;
    var reg2 = /MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/;
    //条件成立说明当前页面是运行在移动端设备中的
    if (reg1.test(navigator.userAgent) || reg2.test(navigator.userAgent)) {
        alert("移动端设备");
        return;
    }
    //反之说明是运行在PC端设备中的
    alert("PC端设备");
}();