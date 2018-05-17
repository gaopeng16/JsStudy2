var sum = require("./a");
var mul = require("./b");
var s = sum.sum([1, 2, 3, 4]);
var m = mul.mul(s);
console.log(m);