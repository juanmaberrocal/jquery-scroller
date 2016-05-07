(function($){

	// define constructor
	var Scroller = function(element, options){
        this.$element = $(element);
        this.options = $.extend({}, $.fn.scroller.defaults, options, this.$element.data());
		
		// initialize scroller dom
		this.overflow = null;
		this.mask = null;
		
		this.init();
	}

	// prototype definition
	Scroller.prototype = {
		constructor: Scroller,
		init: function(){
			// builders
			this._setElementWidth();
			this._wrapElement();
			
			// binders
			this._bindScrollerArrows();
		},
		
		/*
		element modifier
		*/
		// convert element to single long line div
		_setElementWidth: function(){
			var elementWidth = 0;
			this.$element.children().each(function(){
				elementWidth += $(this).outerWidth(true);
			});
			this.$element.outerWidth(elementWidth + 25);
			if (!this.options.height){ this.options.height = this.$element.outerHeight(true); }
		},
		// wrap element in scroller
		_wrapElement: function(){
			this._buildOverflowWrapper();
			this._buildMaskWrapper();
		},
		
		/*
		dom constructor for scroller wrappers of element
		*/
		// overflow
		_buildOverflowWrapper: function(){
			this.$element.wrap("<div>");
			this.overflow = this.$element.parent();
		
			this.overflow
				.attr("class", "scrollerOverflow")
				.css("height", this._wrapperHeight(true));
		},
		// mask
		_buildMaskWrapper: function(){
			this.overflow.wrap("<div>");
			this.mask = this.overflow.parent();
			
			this.mask
				.attr("class", "scrollerMask")
				.css("height", this._wrapperHeight(false))
				.append(this._buildOverflowScroller("left"))
				.append(this._buildOverflowScroller("right"));
		},
		_buildOverflowScroller: function(dir){
			var scrollerIcon = (this.options.scrollerIcon ? this.options.scrollerIcon[dir] : "fa-chevron-" + dir);
			return $("<div>")
				.attr("class", "scrollerOverflowArrow")
				.attr("data-dir", dir)
				.html("<i class=\"fa " + scrollerIcon + "\"></i>");
		},
		// height calculator
		_wrapperHeight: function(masked){
			return (masked ? this.options.height + 25 : this.options.height)
		},
		
		/*
		bindings for scroller wrapper
		*/
		_bindScrollerArrows(){
			var $this = this;
			this.mask.children("div.scrollerOverflowArrow").each(function(){
				$this._bindScrollerArrow(this, this.getAttribute("data-dir"));
			});
		},
		_bindScrollerArrow(arrow, dir){
			var $this = this;
			$(arrow).hover(function(){
				$this.overflow.animate({
					"scrollLeft": (dir == "left" ? -($this.options.scrollSpeed) : $this.options.scrollSpeed)
				});
			});
		}
	}

	// define plugin
	$.fn.scroller = function(option){
		var returnObj = null;
		
		this.each(function(){
			var $this = $(this),
				data = $this.data("scroller"),
				options = typeof option == "object" && option;
				
			if (!data){ $this.data("scroller", (data = new Scroller(this, options))); }
			if (option){
                if (typeof option == "string"){ returnObj = data[option](); }
                else if (option.constructor === Array){ returnObj = data[option[0]](option[1]); }
			}
		});
		
		if (!returnObj){ returnObj = this; }
		return returnObj;
	}
	
	// plugin defaults
	$.fn.scroller.defaults = {
		height: null, // integer
		scrollerIcon: null, // {left: "fa-icon", right: "fa-icon"}
		scrollSpeed: 50
	};
	
	// set plugin constructor
	$.fn.scroller.Constructor = Scroller;
	
	// auto initialize plugin
	$(document).ready(function(){
		$("[data-toggle=\"scroller\"]").scroller();
	});
	
})(window.jQuery);