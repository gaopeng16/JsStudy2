function getRandom(n, m) {
    return Math.round(Math.random() * (m - n) + n);
}

var str1 = "赵钱孙李周吴郑王冯陈楚卫蒋沈韩杨朱秦尤许何吕施张";
var str2 = "一二三四五六七八九壹贰参肆伍陆染捌玖";
var str3 = "";

var ary = [];
for (var i = 1; i <= 99; i++) {
    var obj = {};
    obj.id = i;
    obj.name = str1[getRandom(0, 23)] + str2[getRandom(0, 17)] + str2[getRandom(0, 17)];
    obj.sex = getRandom(0, 1);
    obj.score = getRandom(50, 99);
    ary.push(obj);
}

console.log(JSON.stringify(ary));