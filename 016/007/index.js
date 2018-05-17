(function () {
    //1.数据绑定
    var dataAry = ["img/banner1.jpg", "img/banner2.jpg", "img/banner3.jpg", "img/banner4.jpg", "img/banner5.jpg"];
    var oInner = document.querySelector(".inner");
    var tip = document.querySelector(".tip");
    var count = dataAry.length;
    var winW = window.innerWidth;
    var step = 1;
    /*初始显示的图片的索引*/
    var str = "";
    var strTip = "";

    function fnBind() {
        str += "<img src='' realImg ='" + dataAry[count - 1] + "'/> ";
        dataAry.forEach(function (curImg, index) {
            str += "<img src='' realImg ='" + curImg + "'/> ";
            strTip += "<span></span>";
        });
        str += "<img src='' realImg ='" + dataAry[0] + "'/>";
        oInner.innerHTML = str;
        tip.innerHTML = strTip;
    }

    fnBind();
    var oImgs = document.querySelectorAll(".inner>img");
    var oSpans = document.querySelectorAll(".tip>span");
    oInner.style.width = winW * (count + 2) + "px";
    [].forEach.call(oImgs, function (curImg) {
        curImg.style.width = winW + "px";
    });

    //2.延迟加载
    window.setTimeout(lazyImg, 500);

    function lazyImg() {
        [].forEach.call(oImgs, function (curImg) {
            var tempImg = new Image;
            tempImg.src = curImg.getAttribute("realImg");
            tempImg.onload = function () {
                curImg.src = this.src;
                curImg.className = "fadeIn"
            }
        })
    }

    //3.自动轮播
    var autoTimer = null, interval = 3000;
    selectTip();

    function autoMove() {
        step++;
        oInner.style.left = -step * winW + 'px';
        oInner.style.webkitTransitionDuration = "0.5s";
        if (step > count) {
            window.setTimeout(function () {
                oInner.style.left = -winW + "px";
                oInner.style.webkitTransitionDuration = "0s";
                step = 1;
            }, 500);
        }
        selectTip();
    }

    autoTimer = window.setInterval(autoMove, interval);

    //4.左右滑动
    ["start", "move", "end"].forEach(function (item) {
        oInner.addEventListener("touch" + item, eval(item), false);
    });

    function start(e) {
        window.clearInterval(autoTimer);
        this.style.webkitTransitionDuration = "0s";
        this.startX = e.touches[0].pageX;
        this.startY = e.touches[0].pageY;
        this.startL = parseFloat(this.style.left);
        /*滑动时left的值*/
    }

    function move(e) {
        var moveX = e.touches[0].pageX;
        var moveY = e.touches[0].pageY;
        this.isSw = isSwipe(this.startX, this.startY, moveX, moveY);
        /*是否滑动*/
        this.swipeD = swipeDirection(this.startX, this.startY, moveX, moveY);
        if (this.isSw) {
            if (/^(Left|Right)$/.test(this.swipeD)) {
                this.movePos = moveX - this.startX;
                this.style.left = this.startL + this.movePos + "px";
            }
        }

    }

    function end(e) {
        if (this.isSw) {
            if (this.swipeD == "Left") {
                if (Math.abs(this.movePos) >= (winW / 4)) {/*判断滑动的距离*/
                    step++;
                }
            } else if (this.swipeD == "Right") {
                if (Math.abs(this.movePos) >= (winW / 4)) {
                    step--;
                }
            }
            this.style.left = -step * winW + "px";
            this.style.webkitTransitionDuration = "0.5s";

            selectTip();
            var _this = this;
            if (step > count) {
                window.setTimeout(function () {
                    _this.style.webkitTransitionDuration = "0s";
                    _this.style.left = -winW + "px";
                    step = 1;
                }, 500)
            }
            if (step < 1) {
                window.setTimeout(function () {
                    _this.style.webkitTransitionDuration = "0s";
                    _this.style.left = -winW * count + "px";
                    step = count;
                }, 500)
            }
        }
    }

    function selectTip() {
        var temp = step;
        temp > count ? temp = 1 : null;
        temp < 1 ? temp = count : null;
        [].forEach.call(oSpans, function (item, index) {
            item.className = (temp - 1 == index) ? "select" : null;
        })

    }

    function isSwipe(startX, startY, moveX, moveY) {
        return Math.abs(moveX - startX) > 30 || Math.abs(moveY - startY) > 30;
    }

    function swipeDirection(startX, startY, moveX, moveY) {
        var changeX = moveX - startX;
        var changeY = moveY - startY;
        return Math.abs(changeX) > Math.abs(changeY) ? (changeX > 0 ? "Right" : "Left") : (changeY > 0 ? "Down" : "Up");

    }

})();
