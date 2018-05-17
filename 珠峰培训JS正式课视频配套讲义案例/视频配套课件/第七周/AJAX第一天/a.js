function sum() {
    var total = null;
    arguments.__proto__ = Array.prototype;
    arguments.forEach(function (item, index) {
        item = Number(item);
        if (!isNaN(item)) {
            total += item;
        }
    });
    //[].forEach.call(arguments, function (item, index) {
    //    item = Number(item);
    //    if (!isNaN(item)) {
    //        total += item;
    //    }
    //});
    return total;
}
module.exports.sum = sum;