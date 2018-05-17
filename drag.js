(function () {
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
        fire.call(this, "selfDragStart", e);
    }

    function move(e) {
        this.style.left = this.x + (e.pageX - this.mx) + "px";
        this.style.top = this.y + (e.pageY - this.my) + "px";
        fire.call(this, "selfDragging", e);
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

        fly.call(this);
        drop.call(this);
        fire.call(this, "selfDragEnd", e);
    }

    window.gpDrag = {
        down: down,
        move: move,
        up: up
    }

})();