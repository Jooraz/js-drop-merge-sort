# js-drop-merge-sort 

[![Build Status](https://travis-ci.org/Jooraz/js-drop-merge-sort.svg?branch=master)](https://travis-ci.org/Jooraz/js-drop-merge-sort)
[![Coverage Status](https://coveralls.io/repos/github/Jooraz/js-drop-merge-sort/badge.svg?branch=master)](https://coveralls.io/github/Jooraz/js-drop-merge-sort?branch=master)
[![NPM version](https://img.shields.io/npm/v/drop-merge-sort.svg)](https://www.npmjs.com/package/drop-merge-sort)
[![npm](https://img.shields.io/npm/dm/drop-merge-sort.svg)](https://www.npmjs.com/package/drop-merge-sort)
[![license](https://img.shields.io/github/license/jooraz/js-drop-merge-sort.svg)](https://www.npmjs.com/package/drop-merge-sort)

This is a javascript implementation of drop-merge sort algorithm, originally seen on:
https://github.com/emilk/drop-merge-sort

## Installation
```
npm install drop-merge-sort
```

### Usage

### Example

``` javascript
var dmsort = require('drop-merge-sort');

var compareFunction = function(elem1, elem2) {
    return elem1 - elem2;// asc sort
};

var array = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

array = dmsort(array, compareFunction);//desc sort

console.log(array);
```

## API

#### dmsort(array, [compareFunction])
+ ```array```: object like array
+ ```compareFunction(elem1, elem2)```: function for comparing two elem of iterable
   + Optional, if not given, will use : ```elem1 - elem2```

Quicksort and Mergesort used in here are taken from https://github.com/mgechev/javascript-algorithms

Go there for details on the algorithm itself.

## Benchmarks
Benchmarks were performed on i7-6700k CPU
![Benchmark of sorting 1M integers](images/1000000_int.png)
![Speedup over fastest competitor for 1M integers](images/disorder_1000000_int.png)
![Benchmark of sorting 100k 100-byte strings](images/100000_string.png)
![Speedup over fastest competitor for 100k 100-byte strings](images/disorder_100000_string.png)
