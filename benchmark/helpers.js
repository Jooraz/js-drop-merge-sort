(function (exports) {

    'use strict';

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };

    function generateIntegerSet(factor, setSize) {
        let max = setSize || 1000000;
        let data = [];
        for (let i = 0; i < max; ++i) {
            let el = i;
            if (Math.random() < factor) {
                el = getRandomInt(0, max - 1);
            }
            data.push(el);
        }
        return data;
    };

    function generateStringSet(factor, wordSize, setSize) {
        let max = setSize || 1000000;
        wordSize = wordSize || 100;
        let data = [];
        for (let i = 0; i < max; ++i) {
            let el = i;
            if (Math.random() < factor) {
                el = getRandomInt(0, max - 1);
            }

            el = el.toString();
            let repeats = wordSize - el.length;
            if (repeats < 0) {
                repeats = 0;
            }
            el = "0".repeat(repeats) + el;
            data.push(el);
        }
        return data;
    };

    exports.getRandomInt = getRandomInt;
    exports.generateIntegerSet = generateIntegerSet;
    exports.generateStringSet = generateStringSet;

} (typeof exports === 'undefined' ? window : exports));