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
            newCopy = parent.find('.tile-article').first().text(),
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
      $('[data-trim]').dotdotdot();
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

    setTimers: function() {
      var today = new Date(),
          hour = today.getUTCHours() + 7,
          min = (today.getMinutes() < 10) ? '0' + today.getMinutes() : today.getMinutes(),
          displayDate = (today.getFullYear()) + '-' + (today.getMonth() + 1) + '-' + (today.getDate()),
          timeValue = "" + ((hour > 12) ? hour -12 : hour),
          meridian = (timeValue >= 12) ? "PM" : "AM",
          pacific = "" + (((hour - 3) > 12) ? (hour - 3) -12 : (hour - 3)),
          pacMeridian = (pacific >= 12) ? "PM" : "AM",
          dublin = "" + (((today.getUTCHours() + 1) > 12) ? (today.getUTCHours() + 1) -12 : (today.getUTCHours() + 1)),
          dubMeridian = ((timeValue + 7) >= 12) ? "PM" : "AM",
          munich = "" + (((today.getUTCHours() + 2) > 12) ? (today.getUTCHours() + 2) -12 : (today.getUTCHours() + 2)),
          munMeridian = ((timeValue + 8) >= 12) ? "PM" : "AM";
      $('.times li:eq(0) p').html('<p class="hr-min">' + pacific + ":" + min + '<span class="after">' +  pacMeridian + '</span><br><span class="next">'+ displayDate + '</p>');
      $('.times li:eq(1) p').html('<p class="hr-min">' + timeValue + ":" + min + '<span class="after">' +  meridian + '</span><br><span class="next">'+ displayDate + '</p>');
      $('.times li:eq(2) p').html('<p class="hr-min">' + dublin + ":" + min + '<span class="after">' +  dubMeridian + '</span><br><span class="next">'+ displayDate + '</p>');
      $('.times li:eq(3) p').html('<p class="hr-min">' + munich + ":" + min + '<span class="after">' +  munMeridian + '</span><br><span class="next">'+ displayDate + '</p>');
    },

    calendar : function() {
      $('.date').each(function(i,el) {
        var newDate = $(el).text();
        newDate = new Date(newDate);
        newDate = newDate.toString().split(' ').splice(1, 2).join(' ');
        $(el).html(newDate)
      });
      $('.calendar li').hover(
        function() { $(this).css('cursor', 'pointer'); },
        function() { $(this).css('cursor', 'default'); }
      );
      $('.calendar').on('click', function(ev) {
        var calUrl = $(ev.target).parents('li').data('url');
        window.location = calUrl;
      })
    },

    init : function() {
      if ($('.news-wrapper').length) {
        JZ.replaceContent();
        JZ.addEllipsis();
      }
      JZ.setIE();
      if ($('.times').length) {
        JZ.setTimers();
        setInterval(JZ.setTimers, 10000);
      }
      JZ.calendar();
    }
  };
})();
JZ.init();