//Taken from: https://stackoverflow.com/a/14853974
//Credits to Tomáš Zato
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
        } else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {
    enumerable: false
});

var quickSort = require('../libs/quicksort').quickSort;
var heapSort = require('../libs/heapsort').heapSort;
var helpers = require('../tests/helpers');
var dmsort = require('../src/dmsort').dmsort;
var ProgressBar = require('progress');
var gnuplot = require('gnuplot');

let benchmarks = [{
    count: 1 * 1000,
    type: "int"
}, {
    count: 10 * 1000,
    type: "int"
}, {
    count: 100 * 1000,
    type: "int"
}];

benchmarks.forEach((el) => {
    let count = el.count;
    let type = el.type;
    let results = [];

    let bar = new ProgressBar(`Test of ${count} ${type} [:bar] :percent`, {
        total: 100,
        width: 40
    });

    for (let i = 1; i <= 100; i++) {
        let factor = i / 100;

        let loop = 5;
        let time = [];

        let arrays = [];
        for (let k = 0; k < 4; k++) {
            time[k] = 0;
        }
        for (let j = 0; j < loop; j++) {
            let data = helpers.generateSet(factor, count);
            let arrays = [];
            for (let k = 0; k < 4; k++) {
                arrays[k] = data.slice(); //just in case to ensure unsorted arrays
            }
            var f = (x, y) => x - y;
            t = new Date();
            arrays[0].sort(f);
            time[0] += new Date() - t;

            t = new Date();
            dmsort(arrays[1], f);
            time[1] += new Date() - t;

            t = new Date();
            quickSort(arrays[2], f);
            time[2] += new Date() - t;

            t = new Date();
            heapSort(arrays[3], f);
            time[3] += new Date() - t;

            if (arrays[3].equals(arrays[2]) !== true || arrays[3].equals(arrays[1]) !== true || arrays[3].equals(arrays[0]) !== true) {
                console.log(arrays[0]);
                console.log(arrays[1]);
                console.log(arrays[2]);
                console.log(arrays[3]);
                throw "NOT EQUAL FATAL ERROR";
            }
        }
        for (let j = 0; j < time.length; j++) {
            time[j] /= loop;
        }

        results.push(time.slice());

        bar.tick();
    }

    let g = gnuplot()
        .set('term png size 800, 600')
        //.unset('output')
        .set('style line 11 lc rgb "#808080" lt 1')
        .set('border 3 back ls 11')
        .set('tics nomirror')
        //define grid
        .set('style line 12 lc rgb "#808080" lt 0 lw 1')
        .set('grid back ls 12')

        .set('style line 1 lc rgb "#AA0000" pt 0 ps 1 lt 1 lw 2')
        .set('style line 2 lc rgb "#00AA00" pt  0 ps 1 lt 1 lw 2')
        .set('style line 3 lc rgb "#0000AA" pt  0 ps 1 lt 1 lw 2')
        .set('style line 4 lc rgb "#AA00AA" pt  0 ps 1 lt 1 lw 2')

        .set('key left top')

        .set('xlabel "Randomization"')
        .set('xtics format "%2.0f%%"')
        //.set(`output out.png`)//set output "images/comparisons.png"
        .set(`ylabel "ms to sort a ${count} semi-ordered ${type}"`)
        .set('xrange [1:100]')
        .set('autoscale y')
        .set(`output "images/${count}${type}.png"`)
        .plot(`'-' u ($1*1e2):2 t 'Default' w lp ls 1, \
    '-' u ($1*1e2):2 t 'DropMergeSort' w lp ls 2, \
    '-' u ($1*1e2):2 t 'QuickSort' w lp ls 3, \
     '-' u ($1*1e2):2 t 'HeapSort' w lp ls 4`);

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < results.length; j++) {
            let factor = (j + 1) / 100;
            //console.log(`${factor} ${results[j][i]}`);
            g.println(`${factor} ${results[j][i]}`);
        }
        g.println(`e`);
    }
    g.end();
});