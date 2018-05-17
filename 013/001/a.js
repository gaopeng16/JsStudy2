function sum(ary) {
    var sum = 0;
    for (var i = 0; i < ary.length; i++) {
        sum += ary[i];
    }
    return sum;
}

module.exports = {
    sum: sum
};