(function () {

    function processThis(obj, fn) {
        return function () {
            fn.call(obj);
        }
    }

    /* function fire(selfType, e) {//selfType:自定义事件的类型 e:系统的事件对象
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
 */

    // var fire = gpEvent.fire;

    function down(e) {
        this.x = this.offsetLeft;
        this.y = this.offsetTop;
        this.mx = e.pageX;
        this.my = e.pageY;
        if (this.setCapture) {
            this.setCapture();
            gpEvent.on(this, "mousemove", move);
            gpEvent.on(this, "mouseup", up);
        } else {
            this.MOVE = processThis(this, move);
            this.UP = processThis(this, up);
            gpEvent.on(document, "mousemove", this.MOVE);
            gpEvent.on(document, "mouseup", this.UP);
        }
        e.preventDefault();
        gpEvent.fire.call(this, "selfDragStart", e);
    }

    function move(e) {
        var e = e || event;
        this.style.left = this.x + (e.pageX - this.mx) + "px";
        this.style.top = this.y + (e.pageY - this.my) + "px";
        gpEvent.fire.call(this, "selfDragging", e);
    }

    function up() {
        if (this.releaseCapture) {
            this.releaseCapture();
            gpEvent.off(this, "mousemove", move);
            gpEvent.off(this, "mouseup", up);
        } else {
            gpEvent.off(document, "mousemove", this.MOVE);
            gpEvent.off(document, "mouseup", this.UP);
        }
        gpEvent.fire.call(this, "selfDragEnd");
    }

    window.gpDrag = {
        down: down,
        move: move,
        up: up
    }

})();