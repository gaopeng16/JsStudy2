var oTab = document.getElementById('tab');
var tHead = oTab.tHead;
var oThs = tHead.rows[0].cells;
var tBody = oTab.tBodies[0];
var oRows = tBody.rows;

var data = null;

//1.首先创建一个Ajax对象
var xhr = new XMLHttpRequest();
//2.打开需要请求数据的那个文件地址
xhr.open("get", "./json/data.txt", false);
//3.监听请求状态
xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && /^2\d{2}$/.test(xhr.status)) {
        var val = xhr.responseText;
        data = utils.jsonParse(val);
    }
};
//4.发送请求
xhr.send(null);

//console.log(data);
//数据绑定
function bind() {
    var frg = document.createDocumentFragment();
    for (var i = 0; i < data.length; i++) {
        var cur = data[i];
        var oTr = document.createElement('tr');
        for (var key in cur) {
            var oTd = document.createElement('td');
            if (key == "sex") {
                oTd.innerHTML = cur[key] === 0 ? "男" : "女";
            } else {
                oTd.innerHTML = cur[key];
            }
            oTr.appendChild(oTd);
        }
        frg.appendChild(oTr);
    }
    tBody.appendChild(frg);
    frg = null;
}

bind();

//隔行变色
function changeBg() {
    for (var i = 0; i < oRows.length; i++) {
        oRows[i].className = i % 2 === 1 ? 'bg' : null;
    }
}

changeBg();

//表格排序的方法
function sort(n) {
    var _this = this;
    var ary = utils.listToArray(oRows);
    //点击当前列，需要将其他列的flag恢复到初始值
    for (var k = 0; k < oThs.length; k++) {
        if (oThs[k] !== this) {
            oThs[k].flag = -1;
        }
    }

    this.flag *= -1;
    ary.sort(function (a, b) {
        var curInn = a.cells[n].innerHTML;
        var nexInn = b.cells[n].innerHTML;
        var curInnNum = parseFloat(a.cells[n].innerHTML);
        var nexInnNum = parseFloat(b.cells[n].innerHTML);
        if (isNaN(curInnNum) || isNaN(nexInnNum)) {
            return (curInn.localeCompare(nexInn)) * _this.flag;
        }
        return (curInnNum - nexInnNum) * _this.flag;
    });
    //按照ary中的最新顺序，重新添加
    var frg = document.createDocumentFragment();
    for (var i = 0; i < ary.length; i++) {
        frg.appendChild(ary[i]);
    }
    tBody.appendChild(frg);
    frg = null;
    changeBg();
}

for (var i = 0; i < oThs.length; i++) {
    var curTh = oThs[i];
    curTh.index = i;
    curTh.flag = -1;
    if (curTh.className === 'cursor') {
        curTh.onclick = function () {
            sort.call(this, this.index);
        };
    }
}

/*
oThs[1].flag = 1;//给当前点击这一列增加一个自定义属性flag
oThs[1].onclick = function () {
    sort.call(this);
};
*/











