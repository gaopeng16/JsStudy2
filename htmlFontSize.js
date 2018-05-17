//根据当前屏幕的宽度和设计稿的比例，动态计算当前宽度下的fontSize的值
~function () {
    /*
    * 按照1rem=100px;
    * desW设计稿宽度-->按照设计稿自己可以改动
    * winW手机屏幕宽度
    * ratio比例
    *
    * 设计稿：640   600*300                fontSize=100                   6rem*3rem
      手 机：320    300*150      (320/640)*100->fontSize=50               3rem*1.5rem
      手 机：375                (375/640)*100->fontSize=58.59375
    *
    * */
    var desW = 640,
        winW = document.documentElement.clientWidth,
        ratio = winW / desW;
    var oMain = document.getElementById('main');
    if (winW > desW) {
        oMain.style.margin = "0 auto";
        oMain.style.width = desW + "px";
        return;
    }
    document.documentElement.style.fontSize = ratio * 100 + "px";
}();
