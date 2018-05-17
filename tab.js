//事件委托版本
~function () {
    function tabChange(container, defaultIndex) {
        var tabFirst = utils.firstChild(container), oLis = utils.children(tabFirst),
            divList = utils.children(container, "div");

        defaultIndex = defaultIndex || 0;
        utils.addClass(oLis[defaultIndex], "select");
        utils.addClass(divList[defaultIndex], "select");
        //使用事件委托
        tabFirst.onclick = function (e) {
            e = e || window.event;
            e.target = e.target || e.srcElement;
            if (e.target.tagName.toLowerCase() === "li") {
                detailFn.call(e.target, oLis, divList);
            }

        };
    }

    function detailFn(oLis, divList) {
        var index = utils.index(this);
        utils.addClass(this, "select");
        for (var i = 0; i < divList.length; i++) {
            i === index ? utils.addClass(divList[i], "select") : (utils.removeClass(divList[i], "select"), utils.removeClass(oLis[i], "select"));
        }
    }

    window.gpTab = tabChange;
}();

~function () {
    function tabChange(container, defaultIndex) {
        var tabFirst = utils.firstChild(container), oLis = utils.children(tabFirst),
            divList = utils.children(container, "div");

        defaultIndex = defaultIndex || 0;
        utils.addClass(oLis[defaultIndex], "select");
        utils.addClass(divList[defaultIndex], "select");

        for (var i = 0; i < oLis.length; i++) {
            oLis[i].onclick = function () {
                utils.addClass(this, "select");
                var curSiblings = utils.sibling(this);
                for (var i = 0; i < curSiblings.length; i++) {
                    utils.removeClass(curSiblings[i], "select");
                }
                var index = utils.index(this);
                for (var i = 0; i < divList.length; i++) {
                    i === index ? utils.addClass(divList[i], "select") : utils.removeClass(divList[i], "select");
                }
            }
        }
    }

    window.gpTab2 = tabChange;
}();

//面向对象
~function () {
    function TabChange(container, defaultIndex) {
        return this.init(container, defaultIndex);
    }

    TabChange.prototype = {
        constructor: TabChange,
        defaultIndexEven: function () {
            utils.addClass(this.oLis[this.defaultIndex], "select");
            utils.addClass(this.divList[this.defaultIndex], "select");
        },
        liveClick: function () {
            var _this = this;
            this.tabFirst.onclick = function (e) {
                e = e || window.event;
                e.target = e.target || e.srcElement;
                if (e.target.tagName.toLowerCase() === "li") {
                    _this.detailFn(e.target);
                }

            };
        },
        detailFn: function (curEle) {
            var index = utils.index(curEle);
            utils.addClass(curEle, "select");
            for (var i = 0; i < this.divList.length; i++) {
                i === index ? utils.addClass(this.divList[i], "select") : (utils.removeClass(this.divList[i], "select"), utils.removeClass(this.oLis[i], "select"));
            }
        },
        //初始化，也是当前插件的唯一 入口
        init: function (container, defaultIndex) {
            this.container = container || null;
            this.defaultIndex = defaultIndex || 0;
            this.tabFirst = utils.firstChild(this.container);
            this.oLis = utils.children(this.tabFirst);
            this.divList = utils.children(this.container, "div");

            this.defaultIndexEven();
            this.liveClick();
        }
    };

    window.gpTab = TabChange;
}();








