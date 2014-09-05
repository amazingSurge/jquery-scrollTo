/*! jQuery scrollTo - v0.1.0 - 2014-09-05
* https://github.com/amazingSurge/jquery-scrollTo
* Copyright (c) 2014 amazingSurge; Licensed GPL */
(function(window, document, $, undefined) {
    'use strict';

    // Constructor
    var ScrollTo = function(element, options) {
        this.element = element;
        this.$element = $(element);
        this.$doc = $('body');
        this.options = $.extend(true, {}, ScrollTo.defaults, options);

        this.namespace = this.options.namespace;

        this.classes = {
            active: this.namespace + '_active',
            animating: this.namespace + '_animating',
        };

        this.useMobile = false;
        this.noroll = false;

        var self = this;
        $.extend(self, {
            init: function() {
                self.transition = self.transition();
                self.roll();

                self.$element.on('click.scrollTo', function(event) {
                    event = event || window.event;
                    var target = event.target || event.srcElement;
                    self.$target = $(target);
                    self.active(self.$target);

                    var href = self.$target.attr('data-scrollto');
                    self.$anchor = $('#' + href);
                    self.$doc.trigger('ScrollTo::jump');

                    return false;
                });

                //bind events
                self.$doc.on('ScrollTo::jump', function() {
                    self.noroll = true;

                    self.checkMobile();

                    var speed, easing;

                    if (self.useMobile) {
                        speed = self.options.mobile.speed;
                        easing = self.options.mobile.easing;
                    } else {
                        speed = self.options.speed;
                        easing = self.options.easing;
                    }
                    if (self.$anchor && self.$anchor.length > 0) {
                        self.$doc.addClass(self.classes.animating);

                        var top = self.$anchor.offset().top;
                        if (self.transition.supported) {
                            var pos = $(window).scrollTop();

                            self.$doc.css({
                                'margin-top': -(pos - top) + 'px'
                            });

                            $(window).scrollTop(top);

                            self.insertRule('.duration_' + speed + '{' + self.transition.prefix + 'transition-duration: ' + speed + 'ms;}');

                            self.$doc.addClass('easing_' + easing + ' duration_' + speed).css({
                                'margin-top': ''
                            }).one(self.transition.end, function() {
                                self.noroll = false;
                                self.$doc.removeClass(self.classes.animating + ' easing_' + easing + ' duration_' + speed);
                            });
                        } else {
                            $('html, body').stop(true, false).animate({
                                scrollTop: self.top
                            }, speed, function() {
                                self.$doc.removeClass(self.classes.animating);
                            });

                            return;
                        }
                    } else {
                        return;
                    }
                });

                $(window).scroll(function() {
                    self.roll();
                });
            },
            checkMobile: function() {
                var width = $(window).width();

                if (width < self.options.mobile.width) {
                    self.useMobile = true;
                } else {
                    self.useMobile = false;
                }
            },
            active: function($index) {
                if (typeof $index === 'undefined') {
                    return;
                }
                self.$element.children().removeClass(self.classes.active);
                $index.addClass(self.classes.active);
            },
            roll: function() {
                if (self.noroll) {
                    return;
                }
                self.$doc.find("[id]").each(function() {
                    if (($(window).scrollTop() > $(this).offset().top - self.options.offsetTop) && ($(window).scrollTop() < $(this).offset().top + $(this).height())) {
                        var anchor_href = $(this).attr('id'),
                            $anchor = self.$element.find('[data-scrollto="' + anchor_href + '"]');
                        self.$anchor = $(this);
                        self.active($anchor);
                    }
                });
            },
            transition: function() {
                var e,
                    end,
                    prefix = '',
                    supported = false,
                    el = document.createElement("fakeelement"),
                    transitions = {
                        "WebkitTransition": "webkitTransitionEnd",
                        "MozTransition": "transitionend",
                        "OTransition": "oTransitionend",
                        "transition": "transitionend"
                    };
                for (e in transitions) {
                    if (el.style[e] !== undefined) {
                        end = transitions[e];
                        supported = true;
                        break;
                    }
                }
                if (/(WebKit)/i.test(window.navigator.userAgent)) {
                    prefix = '-webkit-';
                }
                return {
                    prefix: prefix,
                    end: end,
                    supported: supported
                };
            },
            insertRule: function(rule) {
                if (self.rules && self.rules[rule]) {
                    return;
                } else if (self.rules === undefined) {
                    self.rules = {};
                } else {
                    self.rules[rule] = true;
                }

                if (document.styleSheets && document.styleSheets.length) {
                    document.styleSheets[0].insertRule(rule, 0);
                } else {
                    var style = document.createElement('style');
                    style.innerHTML = rule;
                    document.head.appendChild(style);
                }
            }
        });

        this.init();
    };

    ScrollTo.defaults = {
        speed: '1000',
        easing: 'linear',
        namespace: 'scrollTo',
        offsetTop: 50,
        mobile: {
            width: 768,
            speed: '500',
            easing: 'linear',
        }
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
            var method_arguments = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];

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
