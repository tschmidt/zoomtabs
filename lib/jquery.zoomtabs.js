/**
* zoomtabs - jQuery Plugin
*
* Version - 0.1
*
* Copyright (c) 2009 Terry M. Schmidt
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
*/

$.fn.zoomtabs = function (opts) {
	
	var options = $.extend({
		zoomPercent : 10,
		easing		: 'swing',
		speed		: 200
	}, opts);
	
	return this.each(function () {
		var $zoomtab 	= $(this),
			$tabs		= $zoomtab.find('.tabs'),
			$labels		= $zoomtab.find('.label'),
			height		= $tabs.height(),
			hash		= window.location.hash || null;
		
		var panelIds = $tabs.find("a").map(function () {
			return this.hash;
		}).get().join(',');
		
		$zoomtab.find('> div').scrollTop(0);
		
		var $panels = $(panelIds);
		var images 	= [];
		
		$panels.hide().filter(hash ? hash : ':first').show().end().each(function () {
			var $panel 	= $(this),
				bg		= ($panel.css('backgroundImage') || '').match(/url\s*\(["']*(.*?)['"]*\)/),
				img		= null;
			
			if (bg !== null && bg.length && bg.length > 0) {
				bg 	= bg[1];
				img = new Image();
				
				$panel.find("*").wrap('<div style="position: relative; z-index: 2" />');
				$panel.css({'backgroundImage' : 'none'});
				
				$(img).load(function () {
					var width	 = this.width / parseInt($panel.css('fontSize'));
					var widthIn	 = width / 100 * options.zoomPercent;
					var height	 = this.height / parseInt($panel.css('fontSize'));
					var heightIn = height / 100 * options.zoomPercent;
					var top 	 = 0; 
					
					var fullView = {
						height 	: height + 'em',
						width  	: width + 'em',
						top		: top,
						left	: 0
					}
					
					var zoomView = {
						height 	: (height + heightIn) + 'em',
						width  	: (width + widthIn) + 'em',
						top		: '-' + (heightIn / 2) + 'em',
						left	: '-' + (widthIn / 2) + 'em'
					}
					
					$(this).data('fullView', fullView).data('zoomView', zoomView).css(zoomView);
					
				}).prependTo($panel).css({'position' : 'absolute', 'top' : 0, 'left' : 0}).attr('src', bg);
				
				images.push(img);
			}
		});
		
		function zoomImages(zoomType, speed, easing) {
			$(images).each(function () {
				var $image = $(this);
				
				if ($image.is(':visible')) {
					$image.stop().animate($image.data(zoomType), speed, easing)
				} else {
					$image.css($image.data(zoomType), speed)
				}
			});
		}
		
		// Hide the tabs
		$tabs.css({height: 0}).hide();
		
		// Hide the Labels
		$labels.css({ opacity : 0 });
		
		// This causes opera to render the images with zero height and width
		// for the hidden image
		// $panels.hide().filter(':first').show();
		
		$zoomtab.hover(function () {
			// show and zoom out
			zoomImages('fullView', options.speed, options.easing);
			$tabs.stop().animate({ height : height }, options.speed, options.easing);
			$labels.stop().animate({opacity : 1}, options.speed);
		}, function () {
			// hide and zoom in
			zoomImages('zoomView', options.speed, options.easing);
			$tabs.stop().animate({ height : 0}, options.speed, options.easing, function () {
				$tabs.hide();
			});
			$labels.stop().animate({ opacity : 0 }, options.speed);
		});
		
		var hoverIntent = null;
        $tabs.find('a').hover(function () {
            clearTimeout(hoverIntent);
            var el = this;
            hoverIntent = setTimeout(function () {
                $panels.hide().filter(el.hash).show();
            }, 100);
        }, function () {
            clearTimeout(hoverIntent);
        }).click(function () {
            return false;
        });
	});	
};