var tpSlider = (function() {
  'use strict';
  var _slideWidth,
      _elCount,
      _width,
      $slider = $('[data-slide]'),
      $count = $('[data-count]'),
      $next = $('[data-tp] .next-arrow'),
      $prev = $('[data-tp] .prev-arrow');
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
          if (count === 0) { marg = _width;  }
          $prev.removeClass('disabled');
          count++;
          if (count === slW) {
              count--;
              return false;
          }
          else {
              if ((count + 1) === slW) {
                  $next.addClass('disabled');
              }
              else {
                  $next.removeClass('disabled');
              }
          }
          marg =  _width * count;
          $slider.animate({
            marginLeft: minus + marg + 'px'
          });
        }
        if (el === 'prev') {
            $next.removeClass('disabled');
          if (count <= 1) {
            minus = '';
            baseMarg = 0;
            count = 0;
            $prev.addClass('disabled');
          } else {
            minus = '-';
            baseMarg = _width * (count - 1);
            count--;
            $prev.removeClass('disabled');
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
        var factor = 14,
            rangeFloor = factor * count + 1,
            rangeCeiling = factor * (count + 1);

        if (els < factor) {
          $count.text('1 - ' + els);
        } else if ((els > factor) && (count === 0 || count === undefined)) {
          $count.text('1 - ' + factor);
        } else {
          if (rangeCeiling > els) {
            $count.text(rangeFloor + ' - ' + els);
          } else {
           $count.text(rangeFloor + ' - ' + rangeCeiling);
          }
        }
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