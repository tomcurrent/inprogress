$('[href=#about-us]').text('ABOUT US');
var EC = (function() { 
  'use strict';
  var $dataNav = $('[data-navigation]'),
      $contactForm = $('[data-js=contact]'),
      $subscribeForm = $('[data-js=subscribe]'),
      $reportForm = $('[data-js=report]'),
      $dataResults = $('[data-results]'),
      _checkArray = [],
      _testData = {},
      _reason = 'general',
      _valid,

    pageSpecific = function() {
      var pageLocation = window.location.href;
      if (pageLocation.match('owner')) $('html').addClass('owner');
    },

    modalSetUp = function() {
      var matchCase = function(newCase) {
        $('[data-target=".results-modal"]').each(function(i, el) {
          var portTitle = $(el).data('title');
          if (newCase === portTitle) {
             $('[data-dismiss=modal]').trigger('click');
            setTimeout(function() {
              $('[data-title="' + portTitle + '"]').trigger('click');
            }, 500);
          }
        });
      };

      $('[data-modal=blogs]').on('click', '[data-toggle=modal]', function(ev) {
        var content = $('[data-template=blog-template]').html(),
            dataUrl = 'data/blogs.json',
            appendTo = $('[data-append=modal-blog]'), 
            title = $(this).data('title').toLowerCase(),
            selector = '.generic-blog',
            key = 'genericBlog';
        ModalModule.getData(content, dataUrl, appendTo, title, selector, key);
      });

      $('[data-modal=results]').on('click', '[data-toggle=modal]', function() {
        var content = $('[data-template=results-template]').html(),
            dataUrl = 'data/heros.json',
            appendTo = $('[data-append=modal-results]'),
            title = $(this).data('title').toLowerCase(),
            selector = '.results-modal',
            key = 'results';
        ModalModule.getData(content, dataUrl, appendTo, title, selector, key);
      });

      $('[data-append]').on('click', '[data-trigger]', function() {
        var newCase = $(this).data('trigger');
        matchCase(newCase);
      });
    },

    onePageNav = function() {
      $dataNav.onePageNav({
        filter: ':not(.external)',
        scrollThreshold: 0.25,
        scrollOffset: 90
      });

      $('#home, #expertise, #results, #about-us, #blog, #contact')
        .not('.navigation')
        .on('click', function(ev) {
          if ($dataNav.hasClass('in')) $('[data-menu]').click();
        });
    },

    formatDate = function() {
      $('[data-js=date]').each(function(i, el) {
        var val = $(el).html();
        $(el).html((new Date(val)).toString().split(' ').splice(1, 3).join(' '));
      });
    },

    setActiveState = function() {
      $('[data-links=expertise]:eq(0),' +
        '[data-links=about-us]:eq(0),' +
        '[data-name=expertise]:eq(0),' +
        '[data-name=about-us]:eq(0),' +
        '[data-tab=about-us]:eq(0),' +
        '[data-tab=expertise]:eq(0)').addClass('active');
      $('ul.navigation li:eq(0)').addClass('current');
    },

    postForm = function(postData, type, ev) {
      $.post('/', postData);
      $(ev.target).addClass('no-pointer');
      $('[data-results=' + type + ']').fadeIn('slow');
      setTimeout(function() {
        $(ev.target).removeClass('no-pointer');
        $('[data-results=' + type + ']').fadeOut('slow');
      }, 10000);
    },

    inputError = function($container, selector) {
      $container.find(selector)
        .fadeIn('slow')
        .delay(2000)
        .fadeOut('slow');
    },

    validateInput = function($container, _testData, ev) {
      var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
      if (!_testData.firstName || _testData.firstName === 'First Name *') {
        inputError($container, '[data-error=first]');
        return false;
      }
      if (!_testData.lastName || _testData.lastName === 'Last Name *') {
        inputError($container, '[data-error=last]');
        return false;
      }
      if (!_testData.email || _testData.email === 'Email *') {
        inputError($container, '[data-error=1]');
        return false;
      }
      if (!emailReg.test(_testData.email)) {
        inputError($container, '[data-error=2]');
        return false;
      }
      if (!_testData.message || _testData.message === 'Email *') {
        inputError($container, '[data-error=message]');
        return false;
      }
      _valid = true;
      if (_valid) {
        var type = _testData.type,
            postData = $.param(_testData);
        postForm(postData, type, ev);
      }
    },

    setForms = function() {
      submitContact();
      submitBlog();
      submitReport();
      $subscribeForm.on('change', '[type=checkbox]', setCheckbox);
      $subscribeForm.find('[data-checkbox]').click();
      $contactForm.on('change', '[type=radio]', function(ev) {setRadio(ev);});
      $('[data-error]').hide();
      $('[data-js=phone]').mask('(999) 999-9999');
    },

    setRadio = function(ev) {
      _reason = $(ev.target).val();
      $contactForm.find('[type=radio]').each(function(i, el) {
        if ($(el).prop('checked')) {
          $(el).parent('label').addClass('blue');
        } else {
          $(el).parent('label').removeClass('blue').removeProp('checked');
        }
      });
    },

    setCheckbox = function() {
      $subscribeForm.find('[type=checkbox]').each(function(i, el) {
        var checkVal = $(el).val();
        if ($(el).prop('checked')) {
          $(el).siblings('label').addClass('blue');
          _checkArray.push(checkVal);
        } else {
          $(el).siblings('label').removeClass('blue').removeProp('checked');
          for (var j in _checkArray) {
            if (_checkArray[j] === checkVal) {
              _checkArray.splice(j, 1);
              break;
            }
          }
        }
      });
    },

    submitContact = function() {
      $('[data-button=contact]').on('click', function (ev) {
        ev.preventDefault();
        _valid = false;
        _testData = {
          firstName : $contactForm.find('[data-js=first-name]').val(),
          lastName : $contactForm.find('[data-js=last-name]').val(),
          email : $contactForm.find('[data-js=email]').val(),
          phone : $contactForm.find('[data-js=phone]').val(),
          message : $contactForm.find('[data-js=message]').val(),
          reason : _reason,
          type : 'contact'
        };
        validateInput($contactForm, _testData, ev);
      });
    },

    submitBlog = function() {
      $subscribeForm.on('click', '[data-button=subscribe]', function(ev) {
        ev.preventDefault();
        var uniqueArray = _checkArray.filter(function(elem, pos, self) {
          return self.indexOf(elem) === pos;
        });
        _valid = false;
        _testData = {
          firstName : $subscribeForm.find('[data-js=first-name]').val(),
          lastName : $subscribeForm.find('[data-js=last-name]').val(),
          email : $subscribeForm.find('[data-js=email]').val(),
          inqType : uniqueArray,
          type : 'subscribe'
        };
        validateInput($subscribeForm, _testData, ev);
    });
    },

    submitReport = function() {
      $reportForm.on('click', '[data-button=report]', function(ev) {
        ev.preventDefault();
        _valid = false;
        _testData = {
          firstName : $reportForm.find('[data-js=first-name]').val(),
          lastName : $reportForm.find('[data-js=last-name]').val(),
          email : $reportForm.find('[data-js=email]').val(),
          company : $reportForm.find('[data-js=company]').val(),
          type : 'report'
        };
        validateInput($reportForm, _testData, ev);
       });
    },

    imageChange = function(type) {
      $('[data-image]').each(function(i, el) {
        var elSrc = $(el).data('src');
        $(el).attr('src', elSrc + type + '.jpg');
      });
    },

    imageChangeTest = function(type) {
      $('[data-test]').each(function(i, el) {
        var elSrc = $(el).data('src');
        $(el).attr('src', elSrc + type + '.jpg');
      });

    },

    setSize = function() {
      var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      if (windowWidth >= 980) {
        imageChange('');
        imageChangeTest('-small');
      } else if ((windowWidth >= 768) && (windowWidth <= 979)) {
        imageChange('-lds');
      } else if ((windowWidth >= 571) && (windowWidth <= 767)) {
        imageChange('-prt');
      } else if (windowWidth <= 570) {
        imageChange('-hh');
      }
      if (windowWidth <=989) {
        imageChangeTest('');
      }
      if (windowWidth <= 420) {
        imageChangeTest('-small');
      }
    },

    mobileDevice = function() {
      if (WURFL.complete_device_name === 'Apple iPad') {
        if (window.matchMedia('(orientation : portrait)').matches) {
          imageChange('-prt');
        } else if (window.matchMedia('(orientation : landscape)').matches) {
          imageChange('-lds');
        }
      } else if ((WURFL.form_factor === 'Smartphone')) {
         imageChange('-hh');
      }
    },

    rspImg = function () {
      setSize();
      $(window).smartresize(function() {
        setTimeout(function() {
          setSize();
        }, 200);
      });
      $(window).on('orientationchange', function() {
        setTimeout(function() {
          mobileDevice();
        }, 200);
      });
    },

    linkLength = function() {
      var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      $('[data-links=expertise]').each(function(i, el) {
        if (windowWidth <= 630) {
          if (i === 0) $(el).find('a').text('ENGAGEMENT');
          if (i === 1) $(el).find('a').text('PRODUCTIVITY');
          if (i === 2) $(el).find('a').text('INSURANCE');
        } else {
          if (i === 0) $(el).find('a').text('CUSTOMER ENGAGEMENT');
          if (i === 1) $(el).find('a').text('WORKFORCE PRODUCTIVITY');
          if (i === 2) $(el).find('a').text('HEALTH INSURANCE');
        }
      });
    },

    cleanDOM = function() {
      $('.remove').each(function(i, el) {
        $(el).remove();
      });
      $('#careers_2 button.btn').removeData('toggle');
    },

    setBlogs = function() {
      $('[data-links=expertise]').on('click', function(ev) {
        var content = $(ev.target).data('content');
        $('[data-switch]').addClass('invisible');
        $('[data-switch=' + content + ']').removeClass('invisible');
      });
      $('[data-team]').each(function(i, el) {
        if (i ===0 || i === 3 || i === 6) $(el).addClass('first');
      });
    },

    iPadFix = function() {
      if (WURFL.complete_device_name === 'Apple iPad') {
        $('[data-links]').on('touchstart', function(ev) {
          $(ev.target).closest('a.inner').trigger('click');
        });
      }
    },

    phoneInit = function() {
      $(window).on('orientationchange', function() {
        setTimeout(function() {
          phoneFix();
        }, 1000);
      });
    },

    buttonLinks = function() {
      $('[data-target=jobs').on('click', function() {
        window.open( 'https://jobs-tahoepartners.icims.com/jobs/intro?hashed=0&mobile=false&width=900&height=500&bga=true&needsRedirect=false', '_blank');
      });
    };

  return {
    init : function() {
      rspImg();
      iPadFix();
      phoneInit();
      pageSpecific();
      modalSetUp();
      onePageNav();
      formatDate();
      setActiveState();
      cleanDOM();
      setForms();
      setBlogs();
      linkLength();
      buttonLinks();
      $(window).smartresize(function() {
        linkLength();
      });
    }
  };
})();
EC.init();
