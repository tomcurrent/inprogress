var JZ = (function() {
  'use strict';
  var $slider = $('[data-slide]'),
      $overflow = $('[data-overflow=article]');
  return {
    replaceContent : function() {
      $slider.on('click touchstart', 'li', function(ev) {
        var parent = $(ev.target).parents('li'),
            newImage = parent.find('img.news-thumb').attr('src'),
            newHeader = parent.find('.tile-head').text(),
            newCopy = parent.find('.tile-article').text(),
            readMore = parent.data('url');
        $('[data-image]').attr('src', newImage);
        $('[data-head]').text(newHeader);
        $overflow.text(newCopy);
        $('[data-more]').attr('href', readMore);
        JZ.addEllipsis();
      });
    },

    addEllipsis : function() {
      $overflow.dotdotdot({
        callback : function(isTruncated) {
          (isTruncated) ? $('[data-more]').show() : $('[data-more]').hide();
        }
      });
    },

    setIE : function() {
      if (/MSIE (\d+\.\d+);/.test(navigator.appVersion)) {
        var ieversion = Number(RegExp.$1);
        $('html').addClass('all-ie');
        if (ieversion === 8) {
           $('html').addClass('ie-8');
        }
      }
    },

    init : function() {
      JZ.replaceContent();
      JZ.addEllipsis();
      JZ.setIE();
    }
  };
})();
JZ.init();