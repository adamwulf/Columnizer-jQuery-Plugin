php tools/compress.php

rm -rf columnizer
rm columnizer.zip

mkdir columnizer
cp -r src/ columnizer/src
cp -r samples/ columnizer/samples

zip -r columnizer columnizer/*

rm -rf columnizer
rm src/jquery.columnizer.min.js
