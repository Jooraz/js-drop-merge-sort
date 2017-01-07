var assert = require('assert');
var dmsort = require('../src/dmsort').dmsort;

var tests = [
    [],
    [0],
    [0, 1],
    [1, 0],
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
    [0, 1, 3, 2, 4, -5, 6, 7, 8, 9],
    [0, 1, 10, 3, 4, 5, 6, 7, 8, 9],
    [10, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [0, 0, 2, 3, 4, 1, 6, 1, 8, 9],
    [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    [20, 21, 2, 23, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
];

describe('Correct results', function () {
    tests.forEach(function (test) {
        it('correctly sorts ' + test, function () {
            var expected = test.sort();
            var res = dmsort(test);
            assert.deepEqual(res, expected);
        });
    });
});