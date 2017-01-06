(function (exports) {

    'use strict';

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };
    function generateSet(factor, setSize) {
        var max = setSize || 1000000;
        let data = [];
        for (var i = 0; i < max; ++i) {
            if (Math.random() < factor) {
                data.push(getRandomInt(0, max - 1));
            } else {
                data.push(i);
            }
        }
        return data;
    };

  exports.getRandomInt = getRandomInt;
  exports.generateSet = generateSet;

}(typeof exports === 'undefined' ? window : exports));