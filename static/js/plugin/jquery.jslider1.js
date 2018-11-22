/**
 * Slider - jQuery plugin for MetroUiCss framework
 * 
 */

(function($) {

	var pluginName = 'slider', initAllSelector = '[data-role=slider], .slider', paramKeys = ['InitValue', 'Accuracy','Complete','Marker','Type'];

	$[pluginName] = function(element, options) {
		if (!element) {
			return $()[pluginName]({
				initAll : true
			});
		}

		// default settings
		var defaults = {
			// start value of slider
			initValue : 0,
			// accuracy
			accuracy : 1,
			//complete
			complete:'complete',
			//marker
			marker:'marker',
			type:0,
		};

		var plugin = this;
		plugin.settings = {};
		
		var $element = $(element); // reference to the jQuery version of DOM
		// element

		var complete, // complete part element
		marker,circle, // marker element
		currentValuePerc, // current percents count
		$points,
		sliderLength, sliderOffset, sliderStart, sliderEnd, percentPerPixel, markerSize, vertical = false;

		// initialization
		plugin.init = function() {

			plugin.settings = $.extend({}, defaults, options);
			var flag=$element.parent().find("#buyslider").length || $element.parent().find("#batch-buyslider").length;
			var bcolor="#00bb5a";
			if(flag){
				bcolor="#ff3c3c";
			}

			// create inside elements
			complete = $('<div style="background-color:'+bcolor+'" class="'+plugin.settings.complete+'"></div>');
			marker = $('<div class="'+plugin.settings.marker+'"></div>');
			circle = $('<div class="circle"></div>');
			$points=$element.parent().find(".proportioncircle");
			complete.appendTo($element);
			marker.appendTo($element.parent());
			circle.appendTo(marker);
			vertical = $element.hasClass('vertical');
			
			initGeometry();

			// start value
			currentValuePerc = correctValuePerc(plugin.settings.initValue);
			placeMarkerByPerc(currentValuePerc);
			
			var canUseEtcPrice = Number($("#can-use-etc-id").html());
			var canUseWinAmount = Number($("#can-use-win-id").html());
			// init marker handler
			var type = $element.data().type;
			if(canUseEtcPrice != 0 && type == "buy"){
				marker.on('mousedown', function(e) {
					e.preventDefault();
					initGeometry();
					startMoveMarker(e);
				});
				$element.on('mousedown', function(e) {
					e.preventDefault();
					initGeometry();
					startMoveMarker(e);
				});
			}
			
			if(canUseWinAmount != 0 && type == "sell"){
				marker.on('mousedown', function(e) {
					e.preventDefault();
					initGeometry();
					startMoveMarker(e);
				});
				$element.on('mousedown', function(e) {
					e.preventDefault();
					initGeometry();
					startMoveMarker(e);
				});
			}
			
			for(var i=0;i<$points.length;i++){
				var type = $($points[i]).parent().data().type;
				if(canUseEtcPrice != 0 && type == "buy"){
					$($points[i]).click(function(e){
						e.preventDefault();
						initGeometry();
						currentValuePerc = correctValuePerc($(this).data().points);
						placeMarkerByPerc(currentValuePerc);
						$element.trigger('change', [$(this).data().points]);
					});
				}
				if(canUseWinAmount != 0 && type == "sell"){
					$($points[i]).click(function(e){
						e.preventDefault();
						initGeometry();
						currentValuePerc = correctValuePerc($(this).data().points);
						placeMarkerByPerc(currentValuePerc);
						$element.trigger('change', [$(this).data().points]);
					});
				}
			}
//			$points.click(function(e){
//				e.preventDefault();
//				initGeometry();
//				currentValuePerc = correctValuePerc($(this).data().points);
//				placeMarkerByPerc(currentValuePerc);
//				$element.trigger('change', [$(this).data().points]);
//			});
		};

		/**
		 * correct percents using "accuracy" parameter
		 */
		var correctValuePerc = function(value) {
			var accuracy = plugin.settings.accuracy;
 			if (accuracy === 0) {
				return value;
			}
			if (value === 100) {
				return 100;
			} 
//			value = Math.floor(value / accuracy) * accuracy + Math.round(value % accuracy / accuracy) * accuracy;
			value = (value/1).toFixed(0);
			if (value > 100) {
				return 100;
			}
			return value;
		};

		/**
		 * convert pixels to percents
		 */
		var pixToPerc = function(valuePix) {
			var valuePerc;
			valuePerc = valuePix * percentPerPixel;
 			return correctValuePerc(valuePerc);
		};

		/**
		 * convert percents to pixels
		 */
		var percToPix = function(value) {
			if (percentPerPixel === 0) {
				return 0;
			}
			return value / percentPerPixel;
		};

		/**
		 * place marker
		 */
		var placeMarkerByPerc = function(valuePerc) {
			var size, size2;
			if (vertical) {
				size = percToPix(valuePerc) + markerSize;
				size2 = sliderLength - size;
				marker.css('top', size2);
				complete.css('height', size);
			} else {
				size = percToPix(valuePerc);
				var ll = (size*markerSize)/sliderLength;
				marker.css('left', size+ll);
				complete.css('width', size+ll);
			}
 			setPoints(valuePerc);
			
		};
		var setPoints=function(valuePerc){
			var flag=$element.parent().find("#buyslider").length || $element.parent().find("#batch-buyslider").length;
			var bcolor="#00bb5a";
			if(flag){
				bcolor="#ff3c3c";
			}
			var cb="#333333";
			var _href=window.location.href;
			if(_href.indexOf("trade")>0){				
				cb="#ccc";
			}
			if(valuePerc>0){
				if(plugin.settings.type==0){
					$points.get(0).style.background="#921b17";
				}
				if(plugin.settings.type==1){
					$points.get(0).style.background=bcolor;
				}
			}else{
				$points.get(0).style.background=cb;
			}
			if(valuePerc>25){
				if(plugin.settings.type==0){
					$points.get(1).style.background="#921b17";
				}
				if(plugin.settings.type==1){
					$points.get(1).style.background=bcolor;
				}
			}else{
				$points.get(1).style.background=cb;
			}
			if(valuePerc>50){
				if(plugin.settings.type==0){
					$points.get(2).style.background="#921b17";
				}
				if(plugin.settings.type==1){
					$points.get(2).style.background=bcolor;
				}
			}else{
				$points.get(2).style.background=cb;
			}
			if(valuePerc>75){
				if(plugin.settings.type==0){
					$points.get(3).style.background="#921b17";
				}
				if(plugin.settings.type==1){
					$points.get(3).style.background=bcolor;
				}
			}else{
				$points.get(3).style.background=cb;
			}
		}
		/**
		 * when mousedown on marker
		 */
		var startMoveMarker = function(e) {
			// register event handlers
			$(document).on('mousemove.sliderMarker', function(event) {
				movingMarker(event);
			});
			$(document).on('mouseup.sliderMarker', function() {
				$(document).off('mousemove.sliderMarker');
				$(document).off('mouseup.sliderMarker');
				$element.data('value', currentValuePerc);
				$element.trigger('changed', [currentValuePerc]);
			});

			initGeometry();

			movingMarker(e);
		};

		/**
		 * some geometry slider parameters
		 */
		var initGeometry = function() {
			if (vertical) {
				sliderLength = $element.height(); // slider element length
				sliderOffset = $element.offset().top; // offset relative to
				// document edge
				markerSize = marker.height();
			} else {
				sliderLength = $element.width();
				sliderOffset = $element.offset().left;
				markerSize = marker.width();

			}

			percentPerPixel = 100 / (sliderLength - markerSize); // it
			// depends
			// on slider
			// element
			// size
			sliderStart = markerSize / 2;
			sliderEnd = sliderLength - markerSize / 2;
		};

		/**
		 * moving marker
		 */
		var movingMarker = function(event) {
			var cursorPos, percents, valuePix;

			// cursor position relative to slider start point
			if (vertical) {
				cursorPos = event.pageY - sliderOffset;
			} else {
				cursorPos = event.pageX - sliderOffset;
			}

			// if outside
			if (cursorPos < sliderStart) {
				cursorPos = sliderStart;
			} else if (cursorPos > sliderEnd) {
				cursorPos = sliderEnd;
			}

			// get pixels count
			if (vertical) {
				valuePix = sliderLength - cursorPos - markerSize / 2;
			} else {
				valuePix = cursorPos - markerSize / 2;
			}

			// convert to percent
			percents = pixToPerc(valuePix);

			// place marker
			placeMarkerByPerc(percents);

			currentValuePerc = percents;

			$element.trigger('change', [currentValuePerc]);
		};

		// public methods

		/**
		 * if argument value is defined - correct it, store, place marker and
		 * return corrected value else just return current value you can use it
		 * like this: $('.slider').data('slider').val(38)
		 * 
		 * @param value
		 *            (percents)
		 */
		plugin.val = function(value) {
			if (typeof value !== 'undefined') {
				initGeometry();
				currentValuePerc = correctValuePerc(value); 
				placeMarkerByPerc(currentValuePerc);
 				return currentValuePerc;
			} else {
 				return currentValuePerc;
			}
		};

		plugin.init();

	};

	$.fn[pluginName] = function(options) {
		var elements = options.initAll ? $(initAllSelector) : this;
		return elements.each(function() {
			var that = $(this), params = {}, plugin;
			if (undefined == that.data(pluginName)) {
				$.each(paramKeys, function(index, key) {
					params[key[0].toLowerCase() + key.slice(1)] = that.data('param' + key);
				});
				plugin = new $[pluginName](this, params);
				that.data(pluginName, plugin);
			}
		});
	};
	// autoinit
	$(function() {
		$()[pluginName]({
			initAll : true
		});
	});

})(jQuery);