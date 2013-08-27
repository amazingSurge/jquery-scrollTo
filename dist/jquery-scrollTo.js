/*! jQuery scrollTo - v0.1.0 - 2013-08-26
* https://github.com/amazingSurge/jquery-scrollTo
* Copyright (c) 2013 amazingSurge; Licensed GPL */
(function(window, document, $, undefined) {
	'use strict';

	// Constructor
	var ScrollTo = function(element, options) {
		this.element = element;
		this.$element = $(element);
		this.$doc = $('body');
		this.sheet = document.styleSheets[document.styleSheets.length - 1];

		this.options = $.extend(ScrollTo.defaults, options);
		this.namespace = this.options.namespace;
		this.navTop = this.$element.offset().top;
		this.navLeft = this.$element.offset().left;
		this.noroll = false;
		this.disable = false;

		var self = this;
		$.extend(self, {
			init: function() {
				self.prepare();
				self.keep();

				self.$element.on('click.scrollTo', event, function() {
					event = event || window.event;
					var target = event.target || event.srcElement;
					self.$target = $(target);
					self.active(self.$target.parent());
					self.$element.trigger('ScrollTo::jump');
					return false;
				});

				//bind events
				self.$element.on('ScrollTo::jump', function() {
					self.noroll = true;
					var href = self.$target.attr('href');
					var $actualAnchor = $(href);

					if ($actualAnchor && $actualAnchor.length > 0) {
						var top = $actualAnchor.offset().top;

						self.$doc.stop(true, false).animate({
							scrollTop: top
						}, parseInt(self.options.speed), function() {
							self.noroll = false;
						});
					} else {
						return;
					}
				});
			},
			prepare: function() {
				self.insertRule(self.sheet, '.' + self.namespace + '_fixed', 'top: ' + self.navTop + 'px; left: ' + self.navLeft + 'px;', 0);
			},
			active: function($index) {
				if ($index.parent().has(".active").length) {
					$index.parent().find(".active").removeClass("active");
					$index.addClass("active");
				} else {
					$index.addClass("active");
				}
			},
			roll: function() {
				if (self.noroll) {
					return;
				}
				$('body').find("[id]").each(function() {
					if ($(window).scrollTop() > $(this).offset().top - 100 && $(window).scrollTop() < $(this).offset().top + $(this).parent().height()) {
						var anchor_href = $(this).attr('id');
						var $anchor = self.$element.find('[href="#' + anchor_href + '"]');
						self.active($anchor.parent());
					}
				});
			},
			keep: function() {
				if ($(window).scrollTop() > this.navTop) {
					self.$element.addClass('fixed');
				} else {
					self.$element.removeClass('fixed');
				}
			},
			insertRule: function(sheet, selectorText, cssText, position) {
				if (sheet.insertRule) {
					sheet.insertRule(selectorText + "{" + cssText + "}", position);
				} else if (sheet.addRule) {
					sheet.addRule(selectorText, cssText, position);
				}
			}
		});
		$(window).scroll(function() {
			self.keep();
			self.roll();
		});
		this.init();
	};

	ScrollTo.defaults = {
		speed: '1000',
		namespace: 'ScrollTo'
	};
	ScrollTo.prototype = {
		constructor: ScrollTo,

		jump: function() {
			this.$element.trigger('ScrollTo::jump');
		},
		destroy: function() {
			this.$trigger.remove();
			this.$element.data('ScrollTo', null);
			this.$element.off('ScrollTo::jump');
		}
	};

	$.fn.scrollTo = function(options) {
		if (typeof options === 'string') {
			var method = options;
			var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : undefined;

			return this.each(function() {
				var api = $.data(this, 'scrollTo');

				if (api && typeof api[method] === 'function') {
					api[method].apply(api, method_arguments);
				}
			});
		} else {
			return this.each(function() {
				var api = $.data(this, 'scrollTo');
				if (!api) {
					api = new ScrollTo(this, options);
					$.data(this, 'scrollTo', api);
				}
			});
		}
	};
}(window, document, jQuery));
