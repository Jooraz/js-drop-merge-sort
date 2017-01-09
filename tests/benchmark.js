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


// Benchmarks
var quickSort = require('../libs/quicksort').quickSort;
var heapSort = require('../libs/heapsort').heapSort;
var helpers = require('../tests/helpers');
var dmsort = require('../src/dmsort').dmsort;
var ProgressBar = require('progress');
var gnuplot = require('gnuplot');

let benchmarks = [
    {
        count: 10 * 1000,
        type: "int"
    },
    {
        count: 100 * 1000,
        type: "int"
    },
    {
        count: 1000 * 1000,
        type: "int"
    },
    {
        count: 1 * 1000,
        type: "string"
    },
    {
        count: 10 * 1000,
        type: "string"
    },
    {
        count: 100 * 1000,
        type: "string"
    }
];

let measureExecution = function (array, sort, order) {
    let t = process.hrtime();
    array = sort(array, order);
    let t2 = process.hrtime();

    let time = (t2[0] - t[0]) * 1e9 + t2[1] - t[1];
    return {
        time: time,
        array: array
    };
}

benchmarks.forEach((el) => {
    let count = el.count;
    let type = el.type;
    let results = [];

    let bar = new ProgressBar(`Test of ${count} ${type} [:bar] :percent`, {
        total: 100,
        width: 30
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
            let data = [];
            let arrays = [];

            if (type == "string") {
                data = helpers.generateStringSet(factor, 100, count);
            } else {
                data = helpers.generateIntegerSet(factor, count);
            }

            for (let k = 0; k < 4; k++) {
                arrays[k] = data.slice(); //just in case to ensure unsorted arrays
            }

            var sortFunction = (x, y) => x > y ? 1 : -1;
            let t = process.hrtime();
            arrays[0] = arrays[0].sort(sortFunction);
            let t2 = process.hrtime();
            let timeResult = (t2[0] - t[0]) * 1e9 + t2[1] - t[1];
            time[0] += timeResult;

            var result = measureExecution(arrays[1], dmsort, sortFunction);
            time[1] += result.time;
            arrays[1] = result.array;

            result = measureExecution(arrays[2], quickSort, sortFunction);
            time[2] += result.time;
            arrays[2] = result.array;

            result = measureExecution(arrays[3], heapSort, sortFunction);
            time[3] += result.time;
            arrays[3] = result.array;

            if (arrays[1].equals(arrays[3]) !== true ||
                arrays[1].equals(arrays[2]) !== true ||
                arrays[1].equals(arrays[0]) !== true) {
                console.log(arrays);
                throw "NOT EQUAL FATAL ERROR";
            }
        }
        for (let j = 0; j < time.length; j++) {
            time[j] /= loop;
            time[j] /= 1e6;//milliseconds
            time[j] = +(time[j].toFixed(2));
        }
        results.push(time.slice());

        bar.tick();
    }

    let info = type == "string" ? "100-byte strings" : "integers";
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

        .set(`title "Sorting ${count} ${info}"`)

        .set('key left top')

        .set('xlabel "Disorder (%)"')
        .set('xtics format "%2.0f%%"')
        //.set(`output out.png`)//set output "images/comparisons.png"
        .set(`ylabel "ms"`)
        .set('xrange [1:100]')
        .set('autoscale y')
        .set(`output "images/${count}_${type}.png"`)
        .plot(`'-' u ($1*1e2):2 t 'Default' w lp ls 1, \
    '-' u ($1*1e2):2 t 'DropMergeSort' w lp ls 2, \
    '-' u ($1*1e2):2 t 'QuickSort' w lp ls 3, \
    '-' u ($1*1e2):2 t 'HeapSort' w lp ls 4`);

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < results.length; j++) {
            let factor = (j + 1) / 100;
            g.println(`${factor} ${results[j][i]}`);
        }
        g.println(`e`);
    }
    g.end();

    g = gnuplot()
        .set('term png size 800, 600')
        //.unset('output')
        .set('style line 11 lc rgb "#808080" lt 1')
        .set('border 3 back ls 11')
        .set('tics nomirror')
        //define grid
        .set('style line 12 lc rgb "#808080" lt 0 lw 1')
        .set('grid back ls 12')

        .set('style line 1 lc rgb "#AA0000" pt 0 ps 1 lt 1 lw 2')
        // .set('style line 3 lc rgb "#0000AA" pt  0 ps 1 lt 1 lw 2')
        // .set('style line 4 lc rgb "#AA00AA" pt  0 ps 1 lt 1 lw 2')

        .set(`title "Drop-Merge sort speedup while sorting ${count} ${info}"`)

        .set('key left top')

        .set('xlabel "Disorder"')
        .set('xtics format "%2.0f%%"')
        //.set(`output out.png`)//set output "images/comparisons.png"
        .set(`ylabel "Speedup over Fastest Competitor"`)
        .set('xrange [1:100]')
        .set('autoscale y')
        .set(`output "images/disorder_${count}_${type}.png"`)
        .set(`arrow from 1,1 to 100,1 nohead lc rgb 'black'`)
        .plot(`'-' u ($1*1e2):2 t '' w lp ls 1`);

    for (let i = 0; i < results.length; i++) {
        let factor = (i + 1) / 100;
        let s = results[i].slice();
        let dm = s[1];
        s.splice(1,1);

        let temp = Math.max(...s) / dm;
        temp = temp.toFixed(2);
        g.println(`${factor} ${temp}`);
    }
    g.println(`e`);
    g.end();
});