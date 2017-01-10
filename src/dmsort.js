(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.dmsort = factory();
    }
} (this, function () {
    "use strict";

    var quickSort = require('../libs/quicksort').quickSort;

    /**
     * Standard comparing function which helps to order data in ascending order;
     * 
     * @param {any} x
     * @param {any} y
     * @returns x-y;
     */
    function cmpFunction(x, y) {
        return x - y;
    }

    /**
     * Sorts numeric array in ascending order
     * 
     * @param {Array} array
     * @param {function} compareFunction
     * @returns {Array}
     */
    var dmsort = function (array, compareFunction) {
        /// This speeds up well-ordered input by quite a lot.
        const DOUBLE_COMPARISONS = true;

        /// Low RECENCY = faster when there is low disorder (a lot of order).
        /// High RECENCY = more resilient against long stretches of noise.
        /// If RECENCY is too small we are more dependent on nice data/luck.
        const RECENCY = 8;
        /// Back-track several elements at once. This is helpful when there are big clumps out-of-order.
        const FAST_BACKTRACKING = true;

        /// Break early if we notice that the input is not ordered enough.
        const EARLY_OUT = true;

        /// Test for early-out when we have processed len / EARLY_OUT_TEST_AT elements.
        const EARLY_OUT_TEST_AT = 4;

        /// If more than this percentage of elements have been dropped, we abort.
        const EARLY_OUT_DISORDER_FRACTION = 0.6;

        if (!array || array.length < 2) {
            return array;
        }

        compareFunction = compareFunction || cmpFunction;
        let compare = compareFunction;

        // Test for return of comparing function, change true/false to -1/1 or 1/-1;
        let test = compare();
        if (test === true || test === false) {
            compare = (x, y) => compareFunction(x, y) === test ? -1 : 1;
        }

        let length = array.length;
        let dropped = [];
        dropped.length = length; // O(n) additional memory size

        let num_dropped_in_row = 0;
        let write = 0; // Index of where to write the next element to keep.
        let read = 0;  // Index of the input stream.


        let droppedIndex = 0;
        while (read < length) {
            ///Fallback to quicksort
            if (EARLY_OUT &&
                read === (length / EARLY_OUT_TEST_AT) &&
                droppedIndex > (read * EARLY_OUT_DISORDER_FRACTION)) {
                for (let a = 0; a < droppedIndex; a++) {
                    array[write + a] = dropped[a];
                }
                array = quickSort(array, compare);
                //fallback
                return array;
            }

            let write1 = write - 1;
            let prev = array[write1];
            let curRead = array[read];

            if (write == 0 || compare(curRead, prev) >= 0) {
                // The element is order - keep it:
                array[write] = curRead;
                read += 1;
                write += 1;
                num_dropped_in_row = 0;
            } else {
                // The next element is smaller than the last stored one.
                // The question is - should we drop the new element, or was accepting the previous element a mistake?

                /*
                   Check this situation:
                   0 1 2 3 9 5 6 7  (the 9 is a one-off)
                           | |
                           | read
                           write - 1
                    Checking this improves performance because we catch common problems earlier (without back-tracking).
                */
                if (DOUBLE_COMPARISONS &&
                    num_dropped_in_row == 0 &&
                    2 <= write &&
                    // curRead >= array[write - 2]) {
                    compare(curRead, array[write - 2]) >= 0) {
                    // Quick undo: drop previously accepted element, and overwrite with new one:
                    dropped[droppedIndex++] = prev;
                    //dropped.push(prev);
                    array[write1] = curRead;
                    read += 1;
                    continue;
                }

                if (num_dropped_in_row < RECENCY) {
                    // Drop it:
                    dropped[droppedIndex++] = curRead;
                    read += 1;
                    num_dropped_in_row += 1;
                } else {
                    /*
                    We accepted something num_dropped_in_row elements back that made us drop all RECENCY subsequent items.
                    Accepting that element was obviously a mistake - so let's undo it!
 
                    Example problem (RECENCY = 3):    0 1 12 3 4 5 6
                        0 1 12 is accepted. 3, 4, 5 will be rejected because they are larger than the last kept item (12).
                        When we get to 5 we reach num_dropped_in_row == RECENCY.
                        This will trigger an undo where we drop the 12.
                        When we again go to 3, we will keep it because it is larger than the last kept item (1).
 
                    Example worst-case (RECENCY = 3):   ...100 101 102 103 104 1 2 3 4 5 ....
                        100-104 is accepted. When we get to 3 we reach num_dropped_in_row == RECENCY.
                        We drop 104 and reset the read by RECENCY. We restart, and then we drop again.
                        This can lead us to backtracking RECENCY number of elements
                        as many times as the leading non-decreasing subsequence is long.
                    */

                    // Undo dropping the last num_dropped_in_row elements:
                    let trunc_to_length = dropped.length - num_dropped_in_row;
                    droppedIndex -= num_dropped_in_row;
                    read -= num_dropped_in_row;

                    let num_backtracked = 1;
                    write -= 1;

                    if (FAST_BACKTRACKING) {
                        // Back-track until we can accept at least one of the recently dropped elements:
                        let max_of_dropped = Math.max(...array.slice(read, read + num_dropped_in_row + 1));
                        // while (1 <= write && max_of_dropped < array[write - 1]) {
                        while (1 <= write && compare(max_of_dropped, array[write - 1]) < 0) {
                            num_backtracked += 1;
                            write -= 1;
                        }
                    }

                    // Optimized for JS to not change size of array
                    // Drop the back-tracked elements:
                    for (let a = 0; a < num_backtracked; a++) {
                        dropped[droppedIndex++] = array[write + a];
                    }

                    num_dropped_in_row = 0;
                }
            }
        }

        // ------------------------------------------------------------------------
        // Optimized for JS, first resize of dropped array
        // Second step: sort the dropped elements:
        dropped.length = droppedIndex;
        dropped = quickSort(dropped, compare);

        let back = array.length;
        while (dropped.length > 0) {
            let last_dropped = dropped.pop();
            while (0 < write && compare(last_dropped, array[write - 1]) < 0) {
                array[back - 1] = array[write - 1];
                back--;
                write--;
            }
            array[back - 1] = last_dropped;
            back--;
        }

        return array;
    };

    return dmsort;
}));