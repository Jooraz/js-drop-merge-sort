# js-drop-merge-sort [![Build Status](https://travis-ci.org/Jooraz/js-drop-merge-sort.svg?branch=master)](https://travis-ci.org/Jooraz/js-drop-merge-sort)
This is a javascript implementation of drop-merge sort algorithm, originally seen on:

https://github.com/emilk/drop-merge-sort

Quicksort and Mergesort used in here are taken from https://github.com/mgechev/javascript-algorithms

Go there for details on the algorithm itself.

Benchmarks:

![Benchmark of sorting 1M integers](images/1000000_int.png)
![Benchmark of sorting 100k integers](images/100000_int.png)
![Speedup over Quicksort for 100k integers](images/disorder_1000000_int.png)
![Benchmark of sorting 100k 100-byte strings](images/100000_string.png)
![Speedup over Quicksort for 100k 100-byte strings](images/disorder_100000_string.png)