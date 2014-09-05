var tpSlider = (function() {
  'use strict';
  
  var _slideWidth,
      _elCount = 0,
      _width,
      $slider = $('[data-slide]'),
      $count = $('[data-count]');
  return {
    setWidth: function(el, elW) {
      var elWidth = elW;
      $slider.find(el).each(function(i, el) { _elCount = i; });
      _slideWidth = (_elCount * elWidth) + elWidth;
      $slider.css('width', _slideWidth);
    },

    slideListener : function() {
      var minus = '-',
          count = 0,
          marg = _width,
          baseMarg = 0,
          slW = Math.round(_slideWidth / marg);
      $('[data-trigger]').on('click', function(ev) {
        var el = $(ev.target).data('trigger');
        if (el === 'next') {
          minus = '-';
          if (count === 0) marg = _width;
          count++;
          if (count === slW) {
            count--;
            return false;
          }
          marg =  _width * count;
          $slider.animate({
            marginLeft: minus + marg + 'px'
          });
        }
        if (el === 'prev') {
          if (count <= 1) {
            minus = '';
            baseMarg = 0;
            count = 0;
          } else {
            minus = '-';
            baseMarg = _width * (count - 1);
            count--;
          }
          $slider.animate({
            marginLeft: minus + baseMarg + 'px'
          });
        }
      });
    },


    init : function(el, elW) {
      _width = elW;
      tpSlider.setWidth(el, elW);
      tpSlider.slideListener();
    }
  };
})();