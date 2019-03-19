(function () {

    function processThis(obj, fn) {
        return function (e) {
            fn.call(obj, e);
        }
    }
    
    // 创建时间池，并且把需要给当前元素绑定的方法一次的增加到事件池中
    function on(ele, type, fn) {
        if (/^self/.test(type)) {//判断是否是自定义时间,自定义时间已self开头
            if (!ele[type]) {
                ele[type] = [];
            }
            var ary = ele[type];
            for (var i = 0; i < ary.length; i++) {
                if (ary[i] === fn) return;
            }
            ary.push(fn);
        } else {
            if (ele.addEventListener) {
                ele.addEventListener(type, fn, false);
                return;
            }
            //以下是ie6~8的解决方案
            if (!ele["aEvent" + type]) {
                ele["aEvent" + type] = [];
                ele.attachEvent("on" + type, function () {
                    run.call(ele, e)
                });
            }
            var ary = ele["aEvent" + type];
            for (var i = 0; i < ary.length; i++) {
                if (ary[i] === fn) return;
            }
            ary.push(fn);
        }
    }

    function fire(selfType, e) {//selfType:自定义事件的类型 e:系统的事件对象
        var ary = this[selfType];
        if (ary && ary.length) {
            for (var i = 0; i < ary.length;) {
                if (typeof ary[i] !== "function") {
                    ary.splice(i, 1);
                } else {
                    ary[i].call(this, e);
                    i++
                }
            }
        }
    }

    function run(e) {//解决系统事件的兼容性
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
    
    // 在自己的事件池中，把某一个方法移除
    function off(ele, type, fn) {
        if (/^selef/.test(type)) {
            var ary = ele[type];
            if (ary && ary.length) {
                for (var i = 0; i < ary.length; i++) {
                    if (ary[i] === fn) {
                        ary[i] = null;
                        return;
                    }
                }
            }
        } else {
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
    }

    window.gpEvent = {
        processThis: processThis,
        on: on,
        off: off,
        fire: fire
    };

})();
