// version 1.5.0
// http://welcome.totheinter.net/columnizer-jquery-plugin/
// created by: Adam Wulf @adamwulf, adam.wulf@gmail.com

(function($){

 $.fn.columnize = function(options) {


	var defaults = {
		// default width of columns
		width: 400,
		// optional # of columns instead of width
		columns : false,
		// true to build columns once regardless of window resize
		// false to rebuild when content box changes bounds
		buildOnce : false,
		// an object with options if the text should overflow
		// it's container if it can't fit within a specified height
		overflow : false,
		// this function is called after content is columnized
		doneFunc : function(){},
		// if the content should be columnized into a 
		// container node other than it's own node
		target : false,
		// re-columnizing when images reload might make things
		// run slow. so flip this to true if it's causing delays
		ignoreImageLoading : true,
		// should columns float left or right
		columnFloat : "left",
		// ensure the last column is never the tallest column
		lastNeverTallest : false,
		// (int) the minimum number of characters to jump when splitting
		// text nodes. smaller numbers will result in higher accuracy
		// column widths, but will take slightly longer
		accuracy : false
	};
	var options = $.extend(defaults, options);
	
	if(typeof(options.width) == "string"){
		options.width = parseInt(options.width);
		if(isNaN(options.width)){
			options.width = defaults.width;
		}
	}

    return this.each(function() {
	    var $inBox = options.target ? $(options.target) : $(this);
		var maxHeight = $(this).height();
		var $cache = $('<div></div>'); // this is where we'll put the real content
		var lastWidth = 0;
		var columnizing = false;
		
		var adjustment = 0;
		
		$cache.append($(this).contents().clone(true));
	    
	    // images loading after dom load
	    // can screw up the column heights,
	    // so recolumnize after images load
	    if(!options.ignoreImageLoading && !options.target){
	    	if(!$inBox.data("imageLoaded")){
		    	$inBox.data("imageLoaded", true);
		    	if($(this).find("img").length > 0){
		    		// only bother if there are
		    		// actually images...
			    	var func = function($inBox,$cache){ return function(){
				    	if(!$inBox.data("firstImageLoaded")){
				    		$inBox.data("firstImageLoaded", "true");
					    	$inBox.empty().append($cache.children().clone(true));
					    	$inBox.columnize(options);
				    	}
			    	}}($(this), $cache);
				    $(this).find("img").one("load", func);
				    $(this).find("img").one("abort", func);
				    return;
		    	}
	    	}
	    }
	    
		$inBox.empty();
		
		columnizeIt();
		
		if(!options.buildOnce){
			$(window).resize(function() {
				if(!options.buildOnce && $.browser.msie){
					if($inBox.data("timeout")){
						clearTimeout($inBox.data("timeout"));
					}
					$inBox.data("timeout", setTimeout(columnizeIt, 200));
				}else if(!options.buildOnce){
					columnizeIt();
				}else{
					// don't rebuild
				}
			});
		}
         
		/**
		 * this fuction builds as much of a column as it can without
		 * splitting nodes in half. If the last node in the new column
		 * is a text node, then it will try to split that text node. otherwise
		 * it will leave the node in $pullOutHere and return with a height
		 * smaller than targetHeight.
		 * 
         * Returns a boolean on whether we did some splitting successfully at a text point
         * (so we know we don't need to split a real element). return false if the caller should
         * split a node if possible to end this column.
		 *
		 * @param putInHere, the jquery node to put elements into for the current column
		 * @param $pullOutHere, the jquery node to pull elements out of (uncolumnized html)
		 * @param $parentColumn, the jquery node for the currently column that's being added to
		 * @param targetHeight, the ideal height for the column, get as close as we can to this height
		 */
		function columnize($putInHere, $pullOutHere, $parentColumn, targetHeight){
			//
			// add as many nodes to the column as we can,
			// but stop once our height is too tall
			while($parentColumn.height() < targetHeight &&
				  $pullOutHere[0].childNodes.length){
				//
				// Because we're not cloning, jquery will actually move the element"
				// http://welcome.totheinter.net/2009/03/19/the-undocumented-life-of-jquerys-append/
				$putInHere.append($pullOutHere[0].childNodes[0]);
			}
			if($putInHere[0].childNodes.length == 0) return;
			
			// now we're too tall, so undo the last one
			var kids = $putInHere[0].childNodes;
			var lastKid = kids[kids.length-1];
			$putInHere[0].removeChild(lastKid);
			var $item = $(lastKid);
			
			//
			// now lets try to split that last node
			// to fit as much of it as we can into this column
			if($item[0].nodeType == 3){
				// it's a text node, split it up
				var oText = $item[0].nodeValue;
				var counter2 = options.width / 18;
				if(options.accuracy)
				counter2 = options.accuracy;
				var columnText;
				var latestTextNode = null;
				while($parentColumn.height() < targetHeight && oText.length){
					var indexOfSpace = oText.indexOf(' ', counter2);
					if (indexOfSpace != -1) {
						columnText = oText.substring(0, oText.indexOf(' ', counter2));
					} else {
						columnText = oText;
					}
					latestTextNode = document.createTextNode(columnText);
					$putInHere.append(latestTextNode);
					
					if(oText.length > counter2 && indexOfSpace != -1){
						oText = oText.substring(indexOfSpace);
					}else{
						oText = "";
					}
				}
				if($parentColumn.height() >= targetHeight && latestTextNode != null){
					// too tall :(
					$putInHere[0].removeChild(latestTextNode);
					oText = latestTextNode.nodeValue + oText;
				}
				if(oText.length){
					$item[0].nodeValue = oText;
				}else{
					return false; // we ate the whole text node, move on to the next node
				}
			}
			
			if($pullOutHere.children().length){
				$pullOutHere.prepend($item);
			}else{
				$pullOutHere.append($item);
			}
			
			return $item[0].nodeType == 3;
		}
		
		/**
		 * Split up an element, which is more complex than splitting text. We need to create 
		 * two copies of the element with it's contents divided between each
		 */
		function split($putInHere, $pullOutHere, $parentColumn, targetHeight){
			if($pullOutHere.contents().length){
				var $cloneMe = $pullOutHere.contents(":first");
				//
				// make sure we're splitting an element
				if($cloneMe.get(0).nodeType != 1) return;
				
				//
				// clone the node with all data and events
				var $clone = $cloneMe.clone(true);
				//
				// need to support both .prop and .attr if .prop doesn't exist.
				// this is for backwards compatibility with older versions of jquery.
				if($clone.get(0).nodeType == 1 && !$clone.hasClass("dontend")){ 
					$putInHere.append($clone);
					if($clone.is("img") && $parentColumn.height() < targetHeight + 20){
						//
						// we can't split an img in half, so just add it
						// to the column and remove it from the pullOutHere section
						$cloneMe.remove();
					}else if(!$cloneMe.hasClass("dontsplit") && $parentColumn.height() < targetHeight + 20){
						//
						// pretty close fit, and we're not allowed to split it, so just
						// add it to the column, remove from pullOutHere, and be done
						$cloneMe.remove();
					}else if($clone.is("img") || $cloneMe.hasClass("dontsplit")){
						//
						// it's either an image that's too tall, or an unsplittable node
						// that's too tall. leave it in the pullOutHere and we'll add it to the 
						// next column
						$clone.remove();
					}else{
						//
						// ok, we're allowed to split the node in half, so empty out
						// the node in the column we're building, and start splitting
						// it in half, leaving some of it in pullOutHere
						$clone.empty();
						if(!columnize($clone, $cloneMe, $parentColumn, targetHeight)){
							// this node still has non-text nodes to split
							// add the split class and then recur
							$cloneMe.addClass("split");
							if($cloneMe.children().length){
								split($clone, $cloneMe, $parentColumn, targetHeight);
							}
						}else{
							// this node only has text node children left, add the
							// split class and move on.
							$cloneMe.addClass("split");
						}
						if($clone.get(0).childNodes.length == 0){
							// it was split, but nothing is in it :(
							$clone.remove();
						}
					}
				}
			}
		}
		
		
		function singleColumnizeIt() {
			if ($inBox.data("columnized") && $inBox.children().length == 1) {
				return;
			}
			$inBox.data("columnized", true);
			$inBox.data("columnizing", true);
			
			$inBox.empty();
			$inBox.append($("<div class='first last column' style='width:100%; float: " + options.columnFloat + ";'></div>")); //"
			$col = $inBox.children().eq($inBox.children().length-1);
			$destroyable = $cache.clone(true);
			if(options.overflow){
				targetHeight = options.overflow.height;
				columnize($col, $destroyable, $col, targetHeight);
				// make sure that the last item in the column isn't a "dontend"
				if(!$destroyable.contents().find(":first-child").hasClass("dontend")){
					split($col, $destroyable, $col, targetHeight);
				}
				
				while(checkDontEndColumn($col.contents(":last").length && $col.contents(":last").get(0))){
					var $lastKid = $col.contents(":last");
					$lastKid.remove();
					$destroyable.prepend($lastKid);
				}

				var html = "";
				var div = document.createElement('DIV');
				while($destroyable[0].childNodes.length > 0){
					var kid = $destroyable[0].childNodes[0];
					for(var i=0;i<kid.attributes.length;i++){
						if(kid.attributes[i].nodeName.indexOf("jQuery") == 0){
							kid.removeAttribute(kid.attributes[i].nodeName);
						}
					}
					div.innerHTML = "";
					div.appendChild($destroyable[0].childNodes[0]);
					html += div.innerHTML;
				}
				var overflow = $(options.overflow.id)[0];
				overflow.innerHTML = html;

			}else{
				$col.append($destroyable);
			}
			$inBox.data("columnizing", false);
			
			if(options.overflow){
				options.overflow.doneFunc();
			}
			
		}
		
		function checkDontEndColumn(dom){
			if(dom.nodeType != 1) return false;
			if($(dom).hasClass("dontend")) return true;
			if(dom.childNodes.length == 0) return false;
			return checkDontEndColumn(dom.childNodes[dom.childNodes.length-1]);
		}
		
		function columnizeIt() {
			//reset adjustment var
			adjustment = 0;
			if(lastWidth == $inBox.width()) return;
			lastWidth = $inBox.width();
			
			var numCols = Math.round($inBox.width() / options.width);
			if(options.columns) numCols = options.columns;
//			if ($inBox.data("columnized") && numCols == $inBox.children().length) {
//				return;
//			}
			if(numCols <= 1){
				return singleColumnizeIt();
			}
			if($inBox.data("columnizing")) return;
			$inBox.data("columnized", true);
			$inBox.data("columnizing", true);
			
			$inBox.empty();
			$inBox.append($("<div style='width:" + (Math.floor(100 / numCols))+ "%; float: " + options.columnFloat + ";'></div>")); //"
			$col = $inBox.children(":last");
			$col.append($cache.clone());
			maxHeight = $col.height();
			$inBox.empty();
			
			var targetHeight = maxHeight / numCols;
			var firstTime = true;
			var maxLoops = 3;
			var scrollHorizontally = false;
			if(options.overflow){
				maxLoops = 1;
				targetHeight = options.overflow.height;
			}else if(options.height && options.width){
				maxLoops = 1;
				targetHeight = options.height;
				scrollHorizontally = true;
			}
			
			//
			// We loop as we try and workout a good height to use. We know it initially as an average 
			// but if the last column is higher than the first ones (which can happen, depending on split
			// points) we need to raise 'adjustment'. We try this over a few iterations until we're 'solid'.
			for(var loopCount=0;loopCount<maxLoops;loopCount++){
				$inBox.empty();
				var $destroyable;
				try{
					$destroyable = $cache.clone(true);
				}catch(e){
					// jquery in ie6 can't clone with true
					$destroyable = $cache.clone();
				}
				$destroyable.css("visibility", "hidden");
				// create the columns
				for (var i = 0; i < numCols; i++) {
					/* create column */
					var className = (i == 0) ? "first column" : "column";
					var className = (i == numCols - 1) ? ("last " + className) : className;
					$inBox.append($("<div class='" + className + "' style='width:" + (Math.floor(100 / numCols))+ "%; float: " + options.columnFloat + ";'></div>")); //"
				}
				
				// fill all but the last column (unless overflowing)
				var i = 0;
				while(i < numCols - (options.overflow ? 0 : 1) || scrollHorizontally && $destroyable.contents().length){
					if($inBox.children().length <= i){
						// we ran out of columns, make another
						$inBox.append($("<div class='" + className + "' style='width:" + (Math.floor(100 / numCols))+ "%; float: " + options.columnFloat + ";'></div>")); //"
					}
					var $col = $inBox.children().eq(i);
					columnize($col, $destroyable, $col, targetHeight);
					// make sure that the last item in the column isn't a "dontend"
					if(!$destroyable.contents().find(":first-child").hasClass("dontend")){
						split($col, $destroyable, $col, targetHeight);
					}else{
//						alert("not splitting a dontend");
					}
					
					while(checkDontEndColumn($col.contents(":last").length && $col.contents(":last").get(0))){
						var $lastKid = $col.contents(":last");
						$lastKid.remove();
						$destroyable.prepend($lastKid);
					}
					i++;
				}
				if(options.overflow && !scrollHorizontally){
					var IE6 = false /*@cc_on || @_jscript_version < 5.7 @*/;
					var IE7 = (document.all) && (navigator.appVersion.indexOf("MSIE 7.") != -1);
					if(IE6 || IE7){
						var html = "";
						var div = document.createElement('DIV');
						while($destroyable[0].childNodes.length > 0){
							var kid = $destroyable[0].childNodes[0];
							for(var i=0;i<kid.attributes.length;i++){
								if(kid.attributes[i].nodeName.indexOf("jQuery") == 0){
									kid.removeAttribute(kid.attributes[i].nodeName);
								}
							}
							div.innerHTML = "";
							div.appendChild($destroyable[0].childNodes[0]);
							html += div.innerHTML;
						}
						var overflow = $(options.overflow.id)[0];
						overflow.innerHTML = html;
					}else{
						$(options.overflow.id).empty().append($destroyable.contents().clone(true));
					}
				}else if(!scrollHorizontally){
					// the last column in the series
					$col = $inBox.children().eq($inBox.children().length-1);
					while($destroyable.contents().length) $col.append($destroyable.contents(":first"));
					var afterH = $col.height();
					var diff = afterH - targetHeight;
					var totalH = 0;
					var min = 10000000;
					var max = 0;
					var lastIsMax = false;
					$inBox.children().each(function($inBox){ return function($item){
						var h = $inBox.children().eq($item).height();
						lastIsMax = false;
						totalH += h;
						if(h > max) {
							max = h;
							lastIsMax = true;
						}
						if(h < min) min = h;
					}}($inBox));

					var avgH = totalH / numCols;
					if(options.lastNeverTallest && lastIsMax){
						// the last column is the tallest
						// so allow columns to be taller
						// and retry
						adjustment += 30;
						if(adjustment < 100){
							targetHeight = targetHeight + 30;
							if(loopCount == maxLoops-1) maxLoops++;
						}else{
							loopCount = maxLoops;
						}
					}else if(max - min > 30){
						// too much variation, try again
						targetHeight = avgH + 30;
					}else if(Math.abs(avgH-targetHeight) > 20){
						// too much variation, try again
						targetHeight = avgH;
					}else {
						// solid, we're done
						loopCount = maxLoops;
					}
				}else{
					// it's scrolling horizontally, fix the width/classes of the columns
					$inBox.children().each(function(i){
						$col = $inBox.children().eq(i);
						$col.width(options.width + "px");
						if(i==0){
							$col.addClass("first");
						}else if(i==$inBox.children().length-1){
							$col.addClass("last");
						}else{
							$col.removeClass("first");
							$col.removeClass("last");
						}
					});
					$inBox.width($inBox.children().length * options.width + "px");
				}
				$inBox.append($("<br style='clear:both;'>"));
			}
			$inBox.find('.column').find(':first.removeiffirst').remove();
			$inBox.find('.column').find(':last.removeiflast').remove();
			$inBox.data("columnizing", false);

			if(options.overflow){
				options.overflow.doneFunc();
			}
			options.doneFunc();
		}
    });
 };
})(jQuery);
