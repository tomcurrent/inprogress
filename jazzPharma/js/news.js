var JZN = (function() {
  'use strict';
  var $slider = $('[data-slide]'),
      _clickCount;
  return {
    links : function() {
      $slider.on('click', function(ev) {
        var elUrl = $(ev.target).parents('li').data('url') || $(ev.target).data('url');
        window.location = elUrl;
      })
    },

    init : function() {
      JZN.links();
    }
  };
})();
JZN.init();