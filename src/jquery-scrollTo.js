/*
 * scrollTo
 * https://github.com/amazingsurge/jquery-scrollTo
 *
 * Copyright (c) 2013 amazingsurge
 * Licensed under the GPL license.
 */

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
		this.easing = 'easing_' + this.options.easing;
		this.activeClass = this.namespace + '_active';

		this.noroll = false;

		var self = this;
		$.extend(self, {
			init: function() {
				self.prepare();
				self.roll();

				self.$element.on('click.scrollTo', function(event) {
					event = event || window.event;
					var target = event.target || event.srcElement;
					self.$target = $(target);
					self.active(self.$target.parent());
					self.$doc.trigger('ScrollTo::jump');
					return false;
				});

				//bind events
				self.$doc.on('ScrollTo::jump', function() {
					self.noroll = true;
					var href = self.$target.attr('href');
					var $actualAnchor = $(href);

					if ($actualAnchor && $actualAnchor.length > 0) {
						var top = $actualAnchor.offset().top;
						var pos = $(window).scrollTop();
						self.$doc.css({
							'margin-top': -(pos - top) + 'px'
						});
						$(window).scrollTop(top);
						self.$doc.addClass(self.easing).css({
							'margin-top': ''
						});
					} else {
						return;
					}
				});
				self.$doc.on('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd', function() {
					self.noroll = false;
					self.$doc.removeClass(self.easing);
				});

			},
			prepare: function() {
				self.insertRule(self.sheet, '.' + self.easing, '-webkit-transition-duration: ' + self.options.speed + 'ms; transition-duration: ' + self.options.speed + 'ms;', 0);
			},
			active: function($index) {
				if ($index.parent().has('.' + self.activeClass).length) {
					$index.parent().find('.' + self.activeClass).removeClass(self.activeClass);
					$index.addClass(self.activeClass);
				} else {
					$index.addClass(self.activeClass);
				}
			},
			roll: function() {
				if (self.noroll) {
					return;
				}
				self.$doc.find("[id]").each(function() {
					if ($(window).scrollTop() > $(this).offset().top - 100 && $(window).scrollTop() < $(this).offset().top + $(this).parent().height()) {
						var anchor_href = $(this).attr('id');
						var $anchor = self.$element.find('[href="#' + anchor_href + '"]');
						self.active($anchor.parent());
					}
				});
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
			self.roll();
		});
		this.init();
	};

	ScrollTo.defaults = {
		speed: '1000',
		easing: 'linear',
		namespace: 'scrollTo'
	};
	ScrollTo.prototype = {
		constructor: ScrollTo,

		jump: function() {
			this.$doc.trigger('ScrollTo::jump');
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
