/*
 * scrollTo
 * https://github.com/amazingsurge/jquery-scrollTo
 *
 * Copyright (c) 2015 amazingsurge
 * Licensed under the GPL license.
 */

(function(window, document, $, undefined) {
  'use strict';
  // Constructor
  //

  var getTime = function() {
    if (typeof window.performance !== 'undefined' && window.performance.now) {
      return window.performance.now();
    } else {
      return Date.now();
    }
  };

  var requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  var cancelAnimationFrame = (function(id){
    return  window.cancelAnimationFrame       ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame    ||
            function( id ){
               window.clearTimeout( id );
            };
  })(id);



  var asScroll = function(element, options) {
    var self = this;

    this.element = element;
    this.$element = $(element);
    this.options = $.extend(true, {}, asScroll.defaults, options);
    
  
    if(this.options.containerSelector){
      this.$container = $(this.options.containerSelector);
    }else{
      this.$container = this.$element.is(document.body) ? $(window) : this.$element.parent();  
    }
    if(this.$container.length !== 1) return;
    
    this.namespace = this.options.namespace;
    this.attributes = {
      vertical: {
        axis: 'Y',
        overflow: 'overflow-y',

        scroll: 'scrollTop',
        scrollLength: 'scrollHeight',
        pageOffset: 'pageYOffset',

        ffPadding: 'padding-right',

        length: 'height',
        clientLength: 'clientHeight',
        offset: 'offsetHeight',

        crossLength: 'width',
        crossClientLength: 'clientWidth',
        crossOffset: 'offsetWidth'
      },
      horizontal: {
        axis: 'X',
        overflow: 'overflow-x',

        scroll: 'scrollLeft',
        scrollLength: 'scrollWidth',
        pageOffset: 'pageXOffset',

        ffPadding: 'padding-bottom',

        length: 'width',
        clientLength: 'clientWidth',
        offset: 'offsetWidth',

        crossLength: 'height',
        crossClientLength: 'clientHeight',
        crossOffset: 'offsetHeight'
      }
    };


    this.classes = {
    };
  };

  asScroll.prototype = {
    constructor : asScroll,

    init : function(){
      this.$targets = this.$element.find('[data-asScroll-target]');
      this.lists = {};

      this.$targets.each(function(){
        var $target = $(this);

        self.lists[$target.data('data-asScroll-target')] = {
          $el : $target
        }
      });
    },
    scrollTo : function(){
    
    },

    scrollBy : function(){
    
    },

    move : function(){
    
    
    }
  };

  asScroll.defaults = {
    speed: '1000',
    easing: 'linear',
    namespace: 'asScroll',
    offsetTop: 50,
    mobile: {
      width: 768,
      speed: '500',
      easing: 'linear',
    }
  };


  $.fn.asScroll = function(options) {
    if (typeof options === 'string') {
      var method = options;
      var method_arguments = Array.prototype.slice.call(arguments, 1);

      return this.each(function() {
        var api = $.data(this, 'asScroll');

        if (api && typeof api[method] === 'function') {
          api[method].apply(api, method_arguments);
        }
      });
    } else {
      return this.each(function() {
        var api = $.data(this, 'asScroll');
        if (!api) {
          api = new asScroll(this, options);
          $.data(this, 'asScroll', api);
        }
      });
    }
  };
}(window, document, jQuery));
