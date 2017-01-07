(function (exports) {

    'use strict';
    var quickSort = require('../libs/quicksort').quickSort;

    function dmsort(array) {
        /// This speeds up well-ordered input by quite a lot.
        const DOUBLE_COMPARISONS = true;

        /// Low RECENCY = faster when there is low disorder (a lot of order).
        /// High RECENCY = more resilient against long stretches of noise.
        /// If RECENCY is too small we are more dependent on nice data/luck.
        const RECENCY = 8;
        /// Back-track several elements at once. This is helpful when there are big clumps out-of-order.
        //const FAST_BACKTRACKING = true;

        /// Break early if we notice that the input is not ordered enough.
        const EARLY_OUT = true;

        /// Test for early-out when we have processed len / EARLY_OUT_TEST_AT elements.
        const EARLY_OUT_TEST_AT = 4;

        /// If more than this percentage of elements have been dropped, we abort.
        const EARLY_OUT_DISORDER_FRACTION = 0.4; /// seems optimal value for JS while using different quickSort implementation

        if (!array || array.length < 2) {
            return array;
        }

        let length = array.length;
        let dropped = [];
        dropped.length = length; // O(n) additional memory size

        let num_dropped_in_row = 0;
        let write = 0;
        let read = 0;


        let droppedIndex = 0;
        while (read < length) {
            ///Fallback to quicksort
            if (EARLY_OUT &&
                read === (length / EARLY_OUT_TEST_AT) &&
                droppedIndex > (read * EARLY_OUT_DISORDER_FRACTION)) {
                for (var a = 0; a < droppedIndex; a++) {
                    array[write + a] = dropped[a];
                }
                array = quickSort(array);
                return array;
            }

            let write1 = write - 1;
            let prev = array[write1];
            let curRead = array[read];

            if (1 <= write && curRead < prev) {
                if (DOUBLE_COMPARISONS &&
                    num_dropped_in_row == 0 &&
                    2 <= write &&
                    curRead >= array[write - 2]) {
                    dropped[droppedIndex++] = prev;
                    //dropped.push(prev);
                    array[write1] = curRead;
                    read += 1;
                    continue;
                }

                if (num_dropped_in_row < RECENCY) {
                    dropped[droppedIndex++] = curRead;
                    read += 1;
                    num_dropped_in_row += 1;
                } else {
                    var trunc_to_length = dropped.length - num_dropped_in_row;
                    read -= num_dropped_in_row;

                    droppedIndex -= num_dropped_in_row;

                    let num_backtracked = 1;
                    write -= 1;

                    //if (FAST_BACKTRACKING) {
                    // Back-track until we can accept at least one of the recently dropped elements:
                    let max_of_dropped = Math.max(...array.slice(read, read + num_dropped_in_row + 1));
                    while (1 <= write && max_of_dropped < array[write - 1]) {
                        num_backtracked += 1;
                        write -= 1;
                    }
                    //} else {
                    //}

                    for (var a = 0; a < num_backtracked; a++) {
                        dropped[droppedIndex++] = array[write + a];
                    }

                    num_dropped_in_row = 0;
                }
            } else {
                array[write] = curRead;
                read += 1;
                write += 1;
                num_dropped_in_row = 0;
            }
        }
        dropped = dropped.slice(0, droppedIndex);
        dropped = quickSort(dropped);
        //dropped = dropped.sort((x,y)=>x-y);

        var back = array.length;
        while (dropped.length > 0) {
            var last_dropped = dropped.pop();
            while (0 < write && last_dropped < array[write - 1]) {
                array[back - 1] = array[write - 1];
                back--;
                write--;
            }
            array[back - 1] = last_dropped;
            back--;
        }

        return array;
    }
    exports.dmsort = dmsort;

}(typeof exports === 'undefined' ? window : exports));