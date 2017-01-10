var assert = require('assert');
var dmsort = require('../index.js');

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

describe('Correct results for int', function () {
    var asc = (x, y) => x - y;
    var desc = (x, y) => y - x;

    tests.forEach(function (test) {
        it('Correctly sorts ascending ' + test, function () {
            var expected = test.slice().sort(asc);
            var res = dmsort(test.slice(), asc);
            assert.deepEqual(expected, res);
        });
    });

    tests.forEach(function (test) {
        it('Correctly sorts descending ' + test, function () {
            var expected = test.slice().sort(desc);
            var res = dmsort(test.slice(), desc);
            assert.deepEqual(expected, res);
        });
    });
});

tests = [
    ["a", "d", "c", "a1"],
    ['001', '002', '008', '005', '006', '002', '000', '002', '006', '008'],
    ['007', '006', '007', '007', '007', '008', '001', '008', '000', '003'],
    ['006', '004', '008', '008', '002', '008', '005', '000', '001', '002']
];

describe('Correct results for string', function () {
    var asc = (x, y) => x < y ? 1 : -1;
    var desc = (x, y) => x > y ? 1 : -1;

    tests.forEach(function (test) {
        it('Correctly sorts ascending ' + test, function () {
            var expected = test.slice().sort(asc);
            var res = dmsort(test.slice(), asc);
            assert.deepEqual(expected, res);
        });
    });


    tests.forEach(function (test) {
        it('Correctly sorts descending ' + test, function () {
            var expected = test.slice().sort(desc);
            var res = dmsort(test.slice(), desc);
            assert.deepEqual(expected, res);
        });
    });
});