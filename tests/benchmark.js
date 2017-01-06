Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i] == array[i])
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

var quickSort = require('../libs/quicksort').quickSort;
var heapSort = require('../libs/heapsort').heapSort;
var helpers = require('../tests/helpers');
var dmsort = require('../src/dmsort').dmsort;
var fs = require('fs');

fs.writeFileSync("./results/All.txt", "");
fs.writeFileSync("./results/Default.txt", "");
fs.writeFileSync("./results/DropMergeSort.txt", "");
fs.writeFileSync("./results/QuickSort.txt", "");
fs.writeFileSync("./results/HeapSort.txt", "");

for (let i = 1; i <= 100; i++) {
    let factor = i / 100;

    let loop = 5;
    let time = [];

    let arrays = [];
    for (let k = 0; k < 4; k++) {
        time[k] = 0;
    }

    for (let j = 0; j < loop; j++) {
        let data = helpers.generateSet(factor);
        let arrays = [];
        for (let k = 0; k < 4; k++) {
            arrays[k] = data.slice();
        }

        t = new Date();
        arrays[0].sort((x, y) => x - y);
        time[0] += new Date() - t;

        t = new Date();
        dmsort(arrays[1]);
        time[1] += new Date() - t;

        t = new Date();
        quickSort(arrays[2]);
        time[2] += new Date() - t;

        t = new Date();
        heapSort(arrays[3]);
        time[3] += new Date() - t;

        if (arrays[3].equals(arrays[2]) !== true || arrays[3].equals(arrays[1]) !== true || arrays[3].equals(arrays[0]) !== true) {
            throw "NOT EQUAL FATAL ERROR";
        }
    }
    for (let j = 0; j < time.length; j++) {
        time[j] /= loop;
    }

    var all = factor + "\t" + time.join("\t");
    console.log(all);

    fs.appendFileSync("./results/All.txt", all + "\r\n");
    fs.appendFileSync("./results/Default.txt", factor + "\t" + time[0] + "\r\n");
    fs.appendFileSync("./results/DropMergeSort.txt", factor + "\t" + time[1] + "\r\n");
    fs.appendFileSync("./results/QuickSort.txt", factor + "\t" + time[2] + "\r\n");
    fs.appendFileSync("./results/HeapSort.txt", factor + "\t" + time[3] + "\r\n");
}