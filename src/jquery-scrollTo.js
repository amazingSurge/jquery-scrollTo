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
		this.class = this.options.class;

		this.noroll = false;

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
						var top = $actualAnchor.offset().top - self.navHeight;

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
				self.insertRule(self.sheet, '.' + self.namespace + '_fixed', 'position: fixed;margin:0;top: ' + self.navTop + 'px; left: ' + self.navLeft + 'px;', 0);
				if (this.options.top) {
					this.navTop = this.options.top;
				} else {
					this.navTop = this.$element.offset().top;
				}
				if (this.options.left) {
					this.navLeft = this.options.left;
				} else {
					this.navLeft = this.$element.offset().left;
				}
				if (this.options.cover.toUpperCase() === 'YES') {
					this.navHeight = this.$element.height();
				} else if (this.options.cover.toUpperCase() === 'NO') {
					this.navHeight = 0;
				}
			},
			active: function($index) {
				if ($index.parent().has('.' + self.class).length) {
					$index.parent().find('.' + self.class).removeClass(self.class);
					$index.addClass(self.class);
				} else {
					$index.addClass(self.class);
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
			keep: function() {
				if ($(window).scrollTop() > this.navTop) {
					self.$element.addClass(self.namespace + '_fixed');
				} else {
					self.$element.removeClass(self.namespace + '_fixed');
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
		cover: 'no', //No or Yes
		top: null,
		left: null,
		speed: '1000',
		class: 'active',
		namespace: 'scrollTo'
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
