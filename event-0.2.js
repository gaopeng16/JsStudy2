(function () {
    function on(ele, type, fn) {
        if (ele.addEventListener) {
            ele.addEventListener(type, fn, false);
            return;
        }
        //以下是ie6~8的解决方案
        if (!ele["aEvent" + type]) {
            ele["aEvent" + type] = [];
            ele.attachEvent("on" + type, function () {
                run.call(ele)
            });
        }
        var ary = ele["aEvent" + type];
        for (var i = 0; i < ary.length; i++) {
            if (ary[i] === fn) return;
        }
        ary.push(fn);
    }

    function run(e) {
        //ie6~8下绑定的run方法
        var e = window.event;
        var ary = this["aEvent" + e.type];
        e.target = e.srcElement;
        e.stopPropagation = function () {
            e.cancelBubble = true;
        };
        e.preventDefault = function () {
            e.returnValue = false;
        };
        e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
        e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);

        for (var i = 0; i < ary.length;) {
            if (typeof ary[i] !== "function") {
                ary.splice(i, 1);
            } else {
                ary[i].call(this, e);
                i++;
            }
        }
    }

    function off(ele, type, fn) {
        if (ele.removeEventListener) {
            ele.removeEventListener(type, fn, false);
            return;
        }
        var ary = ele["aEvent" + type];
        if (ary && ary.length) {
            for (var i = 0; i < ary.length; i++) {
                if (ary[i] === fn) {
                    ary[i] = null;
                    return;
                }
            }
        }
    }

    window.gpEvent = {
        on: on,
        off: off
    };

})();