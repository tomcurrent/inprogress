var tpSlider = (function() {
  'use strict';
  var _slideWidth,
      _elCount,
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
      $('[data-trigger]').on('click touchstart', function(ev) {
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
        tpSlider.setCount(count);
      });
    },

    setCount : function(count) {
      if ($slider.hasClass('news-slider')) {
        var els;
        $slider.find('li').each(function(i, el) {
          i++;
          els = i;
        });
        $('[data-total]').text(els);
        if (els < 14) $count.text('1 - ' + els);
        if ((els > 14) && (count === 0)) $count.text('1 - 14');
        if ((els > 14) && (count === 1) && (els >= 28)) $count.text('15 - 28');
        if ((els > 14) && (count === 1) && (els <= 28)) $count.text('15 - ' + els);
        if ((els > 28) && (count === 2) && (els >= 42)) $count.text('29 - 42');
        if ((els > 28) && (count === 2) && (els < 42)) $count.text('29 - 42' + els);
        if ((els > 42) && (count === 3) && (els >= 56)) $count.text('43 - 56');
        if ((els > 42) && (count === 3) && (els < 56)) $count.text('43 - ' + els);
        if ((els > 56) && (count === 4) && (els >= 70)) $count.text('57 - 70');
        if ((els > 56) && (count === 4) && (els < 70)) $count.text(' - ' + els);
      }
    },

    init : function(num, el, elW) {
      _width = num;
      tpSlider.setWidth(el, elW);
      tpSlider.slideListener();
      tpSlider.setCount();
    }
  };
})();