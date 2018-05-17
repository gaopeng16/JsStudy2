(function () {
    /**
     * 处理DOM2级事件绑定的兼容性问题
     * @param curEle
     * @param eventType
     * @param eventFn
     */

    function bind(curEle, eventType, eventFn) {
        if ("addEventListener" in document) {
            curEle.addEventListener(eventType, eventFn, false);
            return;
        }
        //给eventFn化妆,目的是为了改变ie6~8中，this(原来是window)的指向，（变成指为curEle）
        var tempFn = function () {
            eventFn.call(curEle);
        };
        //在tempFn上加一个属性，将没有化妆前的eventFn放到这个属性中，方便unbind的时候，根据原eventFn找到tempFn
        tempFn.photo = eventFn;

        //把化妆后的eventFn放到自身属性curEle["myBind" + eventType]这个数组中
        if (!curEle["myBind" + eventType]) {//不同的事件，放到各自的数组中
            curEle["myBind" + eventType] = [];
        }
        //解决重复问题,如果存在，就不添加，事件池中一样不需要添加
        var ary = curEle["myBind" + eventType];
        for (var i = 0; i < ary.length; i++) {
            var cur = ary[i];
            if (cur.photo === eventFn) {
                return;
            }
        }
        ary.push(tempFn);
        //化妆后的存到事件池中
        curEle.attachEvent("on" + eventType, tempFn);
    }

    function unbind(curEle, eventType, eventFn) {
        if ("removeEventListener" in document) {
            curEle.removeEventListener(eventType, eventFn, false);
            return;
        }
        //拿eventFn到curEle["myBind" + eventType]这里找到化妆后的结果，找到之后在事件池中把化妆后的结果移出事件池
        var ary = curEle["myBind" + eventType];
        if (ary && ary instanceof Array) {
            for (var i = 0; i < ary.length; i++) {
                var cur = ary[i];
                if (cur.photo === eventFn) {
                    ary.splice(i, 1);//移除自定义属性中的
                    curEle.detachEvent("on" + eventType, cur);//移除浏览器事件池中的
                    break;
                }
            }
        }
    }

//===解决顺序问题：自己模拟标准浏览器的事件池
    /**
     * 创建事件池，并且把需要给当前元素绑定的方法依次的增加到事件池中
     * @param curEle
     * @param eventType
     * @param eventFn
     */
    function on(curEle, eventType, eventFn) {
        if (!curEle["myEvent" + eventType]) {
            curEle["myEvent" + eventType] = [];
        }
        var ary = curEle["myEvent" + eventType];
        for (var i = 0; i < ary.length; i++) {
            if (ary[i] === eventFn) {
                return;
            }
        }
        ary.push(eventFn);
        // curEle.addEventListener(eventType, run, false);
        bind(curEle, eventType, run);
    }

    /**
     * 在自己的事件池中，把某一个方法移除
     * @param curEle
     * @param eventType
     * @param eventFn
     * 分析->数组塌陷问题：当在执行的过程中，在某一个方法中移出了一些方法，此时我们自己存储
     * 的那个数组就少了一些(每一个函数的索引其实都变为最新的值了),但是run方法执行的时候,i
     * 还是要继续累加的，这样导致部分方法是直接跳过的
     */
    function off(curEle, eventType, eventFn) {
        var ary = curEle["myEvent" + eventType];
        if (ary && ary instanceof Array) {
            for (var i = 0; i < ary.length; i++) {
                var cur = ary[i];
                if (cur === eventFn) {
                    //ary.splice(i, 1);//为了防止塌陷问题，我们在移除的时候不要把原有数组中每一个方法的索引进行改变(数组长度不变)，所以不能用splice
                    ary[i] = null;//不彻底删除，用null占位
                    break;
                }
            }
        }
    }

    /**
     * 只给当前元素的点击行为绑定一个方法run，当触发点击的时候执行的是run方法，
     * 我在run方法中根据自己存储的方法顺序分别执行
     */
    function run(e) {
        var e = e || window.event;
        var flag = e.target ? true : false;//true:标准 false:ie6~8
        if (!flag) {//ie6~8重写这些方法
            e.target = e.srcElement;
            e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
            e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
            e.preventDefault = function () {
                e.returnValue = false;
            };
            e.stopPropagation = function () {
                e.cancelBubble = true;
            }
        }
        //获取自己事件池中绑定的方法，并且让这些方法依次的执行
        //run里的this也就是e.target
        // var ary = e.target["myEvent" + e.type];
        var ary = this["myEvent" + e.type];
        for (var i = 0; i < ary.length; i++) {
            var tempFn = ary[i];
            if (typeof tempFn === "function") {
                tempFn.call(this, e);//此时传递的e，就是处理完的兼容的了
            } else {
                //当前这一项是null，我们再把它移除
                ary.splice(i, 1);
                i--;
            }
        }
    }

    window.gpEvent = {
        on: on,
        off: off
    };
})();