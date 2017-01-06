# thanks to http://www.gnuplotting.org/attractive-plots/

set term pngcairo size 640, 480 # unlike 'png' we get anti-aliasing

# define axis
# remove border on top and right and set color to gray
set style line 11 lc rgb '#808080' lt 1
set border 3 back ls 11
set tics nomirror

# define grid
set style line 12 lc rgb '#808080' lt 0 lw 1
set grid back ls 12

set style line 1 lc rgb '#AA0000' pt 0 ps 1 lt 1 lw 2
set style line 2 lc rgb '#00AA00' pt  0 ps 1 lt 1 lw 2
set style line 3 lc rgb '#0000AA' pt  0 ps 1 lt 1 lw 2
set style line 4 lc rgb '#AA00AA' pt  0 ps 1 lt 1 lw 2

set key bottom

set xlabel "Randomization"
set xtics format "%2.0f%%"

# Generate the comparison graphs:
set output "images/comparisons.png"
set ylabel "ms to sort a million semi-ordered integers"
set xrange [1:100]
set autoscale y
plot 'results/Default.txt'        u ($1*1e2):2 t 'Default'       w lp ls 1, \
     'results/DropMergeSort.txt'    u ($1*1e2):2 t 'DropMergeSort'       w lp ls 2, \
     'results/QuickSort.txt' u ($1*1e2):2 t 'QuickSort' w lp ls 3, \
	 'results/HeapSort.txt' u ($1*1e2):2 t 'HeapSort' w lp ls 4