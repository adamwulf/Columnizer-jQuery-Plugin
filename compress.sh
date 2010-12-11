php compress.php

rm -rf columnizer
rm columnizer.zip

mkdir columnizer
cp jquery*.js columnizer/
cp jquery-1.4.4.js columnizer/
cp *.jpg columnizer/
cp *.html columnizer/

zip columnizer columnizer/*

