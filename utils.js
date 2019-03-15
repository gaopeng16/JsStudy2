//->使用“惰性思想”(JS高阶编程技巧之一)来封装自己常用的方法库:第一次在给utils赋值的时候，我们就已经把兼容处理好了，把最后的结果存放在flag变量中，以后再每一个方法中，只要是IE6~8不兼容的，我们不需要重新的检测，只需要使用flag的值即可
var utils = (function () {
    var flag = "getComputedStyle" in window;//flag这个变量不销毁，存储的是判断当前的浏览器是否兼容getComputedStyle，兼容的话是标准浏览器返回true，但是如果falg=false说明当前的浏览器是IE6~8

    /**
     * 将类数组转化为数组
     * @param likeAry
     */
    function listToArray(likeAry) {
        if (flag) {
            return Array.prototype.slice.call(likeAry);
        }
        var ary = [];
        for (var i = 0; i < likeAry.length; i++) {
            ary[ary.length] = likeAry[i];
        }
        return ary;
    }

    /**
     * 把JSON格式的字符串转换为JSON格式的对象
     * @param str
     */
    function formatJSON(str) {
        var val = null;
        try {
            val = JSON.parse(str);//ie6、7不支持
        } catch (e) {
            val = eval("(" + str + ")");//当eval中的字符串内是对象时加上括号则可以将原对象原样返回
        }
        return val;
    }

    /**
     * 获取页面任意一个元素到body的偏移量不管当前元素的父级参照物是谁
     * @param curEle
     * @returns {{left: *, top: *}}
     */
    function offset(curEle) {
        var disLeft = null, disTop = null, par = curEle.offsetParent;
        //首先把自己的累加
        disLeft += curEle.offsetLeft;
        disTop += curEle.offsetTop;
        //只要没有找到body,就把父级参照物的边框和偏移量也累加
        while (par) {
            //累加边框
            //在标准ie8中，offsetLeft/Top已经把父级参照物的边框算在内了，所以不需要自己单独加边框了
            if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
                disLeft += par.clientLeft;
                disTop += par.clientTop;
            }

            //累加父级参照物本身的偏移
            disLeft += par.offsetLeft;
            disTop += par.offsetTop;

            par = par.offsetParent;
        }
        return {left: disLeft, top: disTop};
    }

    /**
     * 获取或设置浏览器盒子模型属性值
     * @param attr
     * @param value
     */
    function win(attr, value) {
        if (typeof value === 'undefined') {
            return document.documentElement[attr] || document.body[attr];
        } else {
            document.documentElement[attr] = value;
            document.body[attr] = value;
        }
    }

    /**
     * 获取元素的某一个具体的属性值
     * @param curEle [object]
     * @param attr
     */
    function getCss(attr) {
        var val = null, reg = null;
        if (flag) {
            val = window.getComputedStyle(this, null)[attr];
        } else {
            if (attr === 'opacity') {
                val = this.currentStyle['filter'];
                reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;
                val = reg.test(val) ? reg.exec(val[1]) / 100 : 1;
            } else {
                val = this.currentStyle[attr];//兼容ie6~8
            }
        }
        reg = /^-?\d+(\.\d+)?(px|pt|rem|em)?$/i;
        if (reg.test(val)) {
            return parseFloat(val);
        } else {
            return val;
        }
    }

    /**
     * 给当前元素的某一个具体的属性设置属性值
     * @param curEle
     * @param attr
     * @param value
     */
    function setCss(attr, value) {
        if (attr === "float") {
            this["style"]["cssFloat"] = value;
            this["style"]["styleFloat"] = value;
            return;
        }
        if (attr === "opacity") {
            this["style"]["opacity"] = value;
            this["style"]["filter"] = "alpha(opacity=" + value * 100 + ")";
            return;
        }
        var reg = /^(width|height|top|bottom|left|right|((margin|padding)(Top|Bottom|Left|Right)?))$/;
        if (reg.test(attr)) {
            if (!isNaN(value)) {//说明是有效数字
                value += "px";
            }
        }
        this["style"][attr] = value;
    }

    /**
     * 给当前元素的属性批量设置属性值
     * @param curEle
     * @param obj
     */
    function setGroupCss(options) {
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                setCss.call(this, key, options[key]);
            }
        }
    }

    /**
     * 模仿jQuery css 属性
     * @param curEle
     * @returns {*}
     */
    function css(curEle) {
        var ary = Array.prototype.slice.call(arguments, 1);
        var argTwo = arguments[1];
        if (typeof argTwo === "string") {
            if (typeof arguments[2] === "undefined") {
                return getCss.apply(curEle, ary);
            } else {
                setCss.apply(curEle, ary);
            }
        }
        argTwo = argTwo || 0;
        if (argTwo.toString() === "[object Object]") {
            setGroupCss.apply(curEle, ary);
        }
    }

    /**
     * 获取curEle下所有的元素子节点，
     * 如果传递了tagName,可以在获取的集合中进行二次筛选，把指定标签名的获取到
     * @param curEle
     * @param tagName
     */
    function children(curEle, tagName) {
        var ary = [];
        //IE6~8不能使用内置的children属性
        if (!flag) {
            var nodeList = curEle.childNodes;
            for (var i = 0, len = nodeList.length; i < len; i++) {
                var curNode = nodeList[i];
                curNode.nodeType === 1 ? ary[ary.length] = curNode : null;
            }
            nodeList = null;
        } else {
            //标准下可以直接使用children,但是需要把类数组转为数组
            //ary = Array.prototype.slice.call(curEle.children);
            ary = this.listToArray(curEle.children)
        }
        //二次筛选，选出给定的标签
        if (typeof tagName === "string") {
            for (var k = 0; k < ary.length; k++) {
                var curEleNode = ary[k];
                if (curEleNode.nodeName.toLowerCase() !== tagName.toLowerCase()) {
                    ary.splice(k, 1);
                    k--;//防止数组塌陷->因为删除了当前下标位置 后面的下标会回退一位 造成数组塌陷 所以需要自减一位 再进行j++就不会跳过去了
                }
            }
        }
        return ary;
    }

    /**
     *获取浏览器类型和版本号
     * @returns {string}
     * var borwser = utils.getBoroserInfo();
     var verinfo = (borwser + "").replace(/[^0-9.]/ig, "");
     */
    function getBrowserInfo() {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

        if (Sys.ie) {
            return 'IE: ' + Sys.ie;
        }
        if (Sys.firefox) {
            return 'Firefox: ' + Sys.firefox;
        }
        if (Sys.chrome) {
            return 'Chrome: ' + Sys.chrome;
        }
        if (Sys.opera) {
            return 'Opera: ' + Sys.opera;
        }
        if (Sys.safari) {
            return 'Safari: ' + Sys.safari;
        }
    }

    /**
     * 获取上一个哥哥元素节点
     * ie6~8下，首先获取当前元素的一个哥哥节点，判断是否为元素节点，
     * 不是的话基于当前的继续找上面的哥哥节点...一直找到为止，如果没有哥哥节点元素
     * 返回null即可
     * @param curEle
     */
    function prev(curEle) {
        if (flag) {
            return curEle.previousElementSibling;
        }
        var pre = curEle.previousSibling;
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;
    }

    /**
     * 获取下一个弟弟元素节点
     * ie6~8下，原理同prev()
     * @param curEle
     */
    function next(curEle) {
        if (flag) {
            return curEle.nextElementSibling;
        }
        var nex = curEle.nextSibling;
        while (nex && nex.nodeType !== 1) {
            nex = nex.nextSibling;
        }
        return nex;
    }

    /**
     * 获取所有的哥哥节点
     * @param curEle
     */
    function prevAll(curEle) {
        var ary = [];
        var pre = this.prev(curEle);
        while (pre) {
            ary.unshift(pre);
            pre = this.prev(pre);
        }
        return ary;
    }

    /**
     * 获取所有的弟弟节点
     * @param curEle
     * @returns {Array}
     */
    function nextAll(curEle) {
        var ary = [];
        var nex = this.prev(curEle);
        while (nex) {
            ary.push(nex);
            nex = this.prev(nex);
        }
        return ary;
    }

    /**
     * 获取相邻的两个元素节点
     * @param curEle
     */
    function sibling(curEle) {
        var pre = this.prev(curEle);
        var nex = this.next(curEle);
        var ary = [];
        pre ? ary.push(pre) : null;
        nex ? ary.push(nex) : null;
        return ary;
    }

    /**
     * 获取所有的兄弟节点
     * @param curEle
     */
    function siblings(curEle) {
        return this.prevAll(curEle).concat(this.nextAll(curEle));
    }

    /**
     * 获取当前元素索引
     * @param curEle
     */
    function index(curEle) {
        return this.prevAll(curEle).length;
    }

    /**
     * 获取第一个元素子节点
     * @param curEle
     */
    function firstChild(curEle) {
        var chs = this.children(curEle);
        return chs.length > 0 ? chs[0] : null;
    }

    /**
     * 获取最后一个元素子节点
     * @param curEle
     * @returns {null}
     */
    function lastChild(curEle) {
        var chs = this.children(curEle);
        return chs.length > 0 ? chs[chs.length - 1] : null;
    }

    /**
     * 向指定容器的末尾追加元素
     * @param newEle
     * @param container
     */
    function append(newEle, container) {
        container.appendChild(newEle);
    }

    /**
     * 向指定容器的开头追加元素
     * @param newEle
     * @param container
     */
    function prepend(newEle, container) {
        var fir = this.firstChild(container);
        if (fir) {
            container.insertBefore(newEle, fir);
            return;
        }
        container.appendChild(newEle);
    }

    /**
     * 追加到指定元素的前面
     * @param newEle
     * @param oldEle
     */
    function insertBefore(newEle, oldEle) {
        oldEle.parentNode.insertBefore(newEle, oldEle);
    }

    /**
     * 追加到指定元素的后面
     * @param newEle
     * @param oldEle
     */
    function insertAfter(newEle, oldEle) {
        var nex = this.next(oldEle);
        if (nex) {
            oldEle.parentNode.insertBefore(newEle, oldEle);
            return;
        }
        oldEle.parentNode.appendChild(newEle);
    }

    /**
     * 验证当前元素中是否包含className的类名
     * @param curEle
     * @param className
     */
    function hasClass(curEle, className) {
        var reg = new RegExp("(^| +)" + className + "( +|$)");
        return reg.test(curEle.className);
    }

    /**
     * 给当前元素添加一个或多个类名
     * @param curEle
     * @param className
     */
    function addClass(curEle, className) {
        var ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (var i = 0; i < ary.length; i++) {
            var curName = ary[i];
            if (!hasClass(curEle, curName)) {
                curEle.className += " " + curName;
            }
        }
    }

    /**
     * 移除当前元素的一个或多个类名
     * @param curEle
     * @param className
     */
    function removeClass(curEle, className) {
        var ary = className.replace(/(^ +| +$)/g, "").split(/ +/g);
        for (var i = 0; i < ary.length; i++) {
            var curName = ary[i];
            if (hasClass(curEle, curName)) {
                var reg = new RegExp("(^| +)" + curName + "( +|$)", "g");
                curEle.className = curEle.className.replace(reg, " ");
            }
        }
    }

    /**
     * 通过元素的样式类名，获取一组元素集合
     * @param strName string要获取的样式类名(一个或多个)
     * @param context   获取元素的上下文(如果不给，默认document)
     */
    function getElementsByClass(strName, context) {
        context = context || document;
        if (flag) {
            return this.listToArray(context.getElementsByClassName(strName));
        }
        var ary = [];
        var strClassAry = strName.replace(/(^ +| +$)/g, "").split(/ +/g);
        //获取指定上下文中的所有的元素标签，循环这些标签，获取每一个标签的className样式类名的字符串
        var nodeList = context.getElementsByTagName("*");
        for (var i = 0, len = nodeList.length; i < len; i++) {
            var curNode = nodeList[i];
            var exists = true;//假设curNode中包含了所有的样式
            for (var k = 0; k < strClassAry.length; k++) {
                var curName = strClassAry[k];
                var reg = new RegExp("/(^| +)" + curName + "( +|$)/");
                if (!reg.test(curNode.className)) {
                    exists = false;
                    break;
                }
            }
            if (exists) {
                ary[ary.length] = curNode;
            }
        }
        return ary;
    }

    return {
        win: win,
        offset: offset,
        listToArray: listToArray,
        formatJSON: formatJSON,
        children: children,
        prev: prev,
        next: next,
        prevAll: prevAll,
        nextAll: nextAll,
        sibling: sibling,
        siblings: siblings,
        index: index,
        firstChild: firstChild,
        lastChild: lastChild,
        append: append,
        prepend: prepend,
        insertBefore: insertBefore,
        insertAfter: insertAfter,
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        getElementsByClass: getElementsByClass,
        css: css,
        getBrowserInfo: getBrowserInfo
    }
})();
