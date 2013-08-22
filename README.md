## Documentation

### CSS Classes for Created Columns

Columnizer will add CSS classes to the columns it creates. Each column will have a "column" classname. The first column will have "first" and last column will have "last". This lets you target specific columns in your CSS markup more easily.

### Options

<table style="width: 100%; border: 1px solid #000000; margin-bottom: 25px;" border="1" cellspacing="0" cellpadding="3">
<tbody>
<tr>
<th style="width: 200px; background-color: #6690bc;" align="center" valign="middle"><span style="color: #ffffff;">Option Name</span></th>
<th style="background-color: #6690bc;" align="center" valign="middle"><span style="color: #ffffff;">Purpose</span></th>
</tr>
<tr>
<td style="text-align: right; padding-right: 10px;"><em>width</em></td>
<td style="padding-left: 10px;">a rough width your columns, and Columnizer will create as many as will fit in the browser window</td>
</tr>
<tr>
<td style="text-align: right; padding-right: 10px;"><em>height</em></td>
<td style="padding-left: 10px;">This option can only be used in conjunction with the width option. When both the width and height options are set, columns will continue to be built to those measurements to fill all of the content. This is useful for scrolling columns horizontally. See <a href="http://welcome.totheinter.net/autocolumn/sample5.html">sample 5</a> for an example.</td>
</tr>
<tr>
<td style="text-align: right; padding-right: 10px;"><em>columns</em></td>
<td style="padding-left: 10px;">an alternative to the width option. Sets a static number of columns to build, regardless of widget.</td>
</tr>
<tr>
<td style="text-align: right; padding-right: 10px;"><em>target</em></td>
<td style="padding-left: 10px;">An optional CSS selector may be used here to determine where the columnized content should be placed. If a target is specified, the columnized node will remain unchanged, and the target node will contain columnized content.</td>
</tr>
<tr>
<td style="text-align: right; padding-right: 10px;"><em>doneFunc</em></td>
<td style="padding-left: 10px;">This function will be called when columnizing is complete.</td>
</tr>
<tr>
<td style="text-align: right; padding-right: 10px;"><em>ignoreImageLoading<br>
</em></td>
<td style="padding-left: 10px;">true by default. If set to false, Columnizer will try to wait until images in the content have loaded before columnizing the data.</td>
</tr>
<tr>
<td style="text-align: right; padding-right: 10px;"><em>columnFloat</em></td>
<td style="padding-left: 10px;">default is “left”. Change to “right” for right to left languages.</td>
</tr>
<tr>
<td style="text-align: right; padding-right: 10px;"><em>lastNeverTallest<br>
</em></td>
<td style="padding-left: 10px;">false by default. Set to true to ensure that the last column of the columnized content is not the tallest column.</td>
</tr>
<tr>
<td style="text-align: right; padding-right: 10px;"><em>buildOnce</em></td>
<td style="padding-left: 10px;">if buildOnce is false, the content will be re-columnized when the window is resized. If buildOnce is true, the content will only be columnized once.</td>
</tr>
<tr>
<td style="text-align: right; padding-right: 10px;" rowspan="4" valign="top"><em>overflow</em></td>
<td style="padding-left: 10px;">If this option is used, then a static height is set to the columnized content, and any content that does not fit within the height is put into the element specified by $(id). See <a href="http://welcome.totheinter.net/autocolumn/sample1.html">demo 1</a> for an example.</td>
</tr>
<tr>
<td style="padding-left: 10px;"><em>height</em> (required): the static height for the columnized content</td>
</tr>
<tr>
<td style="padding-left: 10px;"><em>id</em> (required): The id of the element to put the remainder of the content</td>
</tr>
<tr>
<td style="padding-left: 10px;"><em>doneFunc</em> (optional): a function to be called after the content has been columnized. This is a great place to columnize the remainder content.</td>
</tr>
<tr>
<td style="text-align: right; padding-right: 10px;"><em>manualBreaks</em></td>
<td style="padding-left: 10px;">Defaults to false. Set to true if you only want to create columns with manual column breaks. If true, then width, height, columns options are ignored.</td>
</tr>
</tbody>
</table>


### CSS Classes

<table style="width: 100%; border: 1px solid #000000; margin-bottom: 25px;" border="1" cellspacing="0" cellpadding="3">
<tbody>
<tr>
<th style="width: 200px; background-color: #6690bc;" align="center" valign="middle"><span style="color: #ffffff;">Class Name</span></th>
<th style="background-color: #6690bc;" align="center" valign="middle"><span style="color: #ffffff;">Purpose</span></th>
</tr>
<tr>
<td style="text-align: right; padding-right: 10px;"><em>columnbreak</em></td>
<td style="padding-left: 10px;">Any node that has the CSS class “columnbreak” will act as a column break, as you'd expect in any word processor. The "columnbreak" node will always be the last node in its column. Works well with the optional "columnBreak" option.</td>
</tr>
<tr>
<td style="text-align: right; padding-right: 10px;"><em>dontsplit</em></td>
<td style="padding-left: 10px;">Any node that has the CSS class “dontsplit” won’t be split into multiple columns. This is handy to make sure that tables, etc, aren’t chopped in half if they land at the bottom of a column.</td>
</tr>
<tr>
<td style="text-align: right; padding-right: 10px;"><em>dontend</em></td>
<td style="padding-left: 10px;">Any node that has the CSS class “dontend” will never be put at the end of a column.</td>
</tr>
<tr>
<td style="text-align: right; padding-right: 10px;"><em>removeiffirst</em></td>
<td style="padding-left: 10px;">Any node that has the CSS class “removeiffirst” will be removed from the content if it is the first node in a column.</td>
</tr>
<tr>
<td style="text-align: right; padding-right: 10px;"><em>removeiflast</em></td>
<td style="padding-left: 10px;">Any node that has the CSS class “removeiflast” will be removed from the content if it is the last node in a column.</td>
</tr>
</table>


### Helpful Hints

1. You can specify a rough width your columns, and Columnizer will create as many as will fit in the browser window. Just use: $(‘selector’).columnize({width: 400 }) syntax
2. You can specify a specific number of columns, and Columnizer will distribute your content between that many columns. Just use: $(‘selector’).columnize({columns: 2 }) syntax
3. When using the width and height options to scroll horizontally, make sure that the .column CSS class does not specify any padding or margin or border. See CSS for sample 5 for an example on how to create buffer between columns.
4. Make sure that you are columnizing visible content. If your content is display:none it may not columnize correctly. Try visibility:hidden and display:block instead.
5. Columnizer does not auto-class any of your content. See the Suggested Defaults For Your Content section.


### Suggested Defaults For Your Content

Columnizer does not add default "dontsplit" or "dontend" classes to your content. If you are finding your content is breaking columns at awkward locations, try the following:

     $yourContent.find('table, thead, tbody, tfoot, colgroup, caption, label, legend, script, style, textarea, button, object, embed, tr, th, td, li, h1, h2, h3, h4, h5, h6, form').addClass('dontsplit');
     $yourContent.find('h1, h2, h3, h4, h5, h6').addClass('dontend');
     $yourContent.find('br').addClass('removeiflast').addClass('removeiffirst');


## Troubleshooting

### Why isn't my content columnizing?

Make sure that your content "has display". If the content you're columnizing has display:none, then the browser has difficulty estimating the size of some nodes, which makes columnizing impossible. instead of display:none, use visibility:hidden and keep display:block. then in the doneFunc() of columnizer, change the visibility and display to whatever your page or application needs.


## Additional Notes

### Minimize
To compress into a zip file, run compress.sh

### Bug report?
Check the issues on the [GitHub page](https://github.com/adamwulf/Columnizer-jQuery-Plugin/issues)
