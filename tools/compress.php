<?
require 'jsmin-1.1.1.php';

// Output a minified version of example.js.
file_put_contents("src/jquery.columnizer.min.js", JSMin::minify(file_get_contents('src/jquery.columnizer.js')));
?>
