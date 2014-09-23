var MenusModel = (function() {
  'use strict';
  return {
    dataGlobal : function() { 
      var configGlobal = {
        global : [
          {className: "person", copy: "+You", url: "#"},
          {className: "directory", copy: "Directory", url: "#"},
          {className: "time", copy: "Time Entry", url: "#"},
          {className: "pay", copy: "Payroll", url: "#"},
          {className: "travel", copy: "Travel", url: "#"},
          {className: "itSc", copy: "IT SC", url: "#"},
          {className: "holiday", copy: "Holidays", url: "#"}
          ]
      };
      return configGlobal;
    },

    dataSlide : function() {
      var configSlide = {
        link1: {displayName: "home", icon: "icon_home"},
        link2: {displayName: "Collaboration", icon: "icon_work",
            subLinks: [
              {dispName: "Business Units", url: "#"},
              {dispName: "Communities", url: "#"},
              {dispName: "Projects", url: "#"}
            ]
        },
        link3: {displayName: "Employee Services", icon: "icon_person",
            subLinks: [
              {dispName: "Benefits/Health", url: "#"},
              {dispName: "Employee/Comp.", url: "#"},
              {dispName: "Orientation/Training", url: "#"},
              {dispName: "Work/Life", url: "#"}
            ]
        },
        link4: {displayName: "Workplace Services", icon: "icon_project",
          subLinks: [
            {dispName: "Technology/Services", url: "#"},
            {dispName: "Order/Reserve", url: "#"},
            {dispName: "Job Aids/Templates", url: "#"}
          ]
        },
        link5: {displayName: "Dashboards", icon: "icon_dashboards",
          subLinks: [
            {dispName: "News & Culture", url: "#"},
            {dispName: "Leadership", url: "#"},
            {dispName: "About Business Units", url: "#"}
          ]
        },
        link6: {displayName: "Inside HIMSS", icon: "icon_company",
          subLinks: [
            {dispName: "News & Culture", url: "#"},
            {dispName: "Leadership", url: "#"},
            {dispName: "Corporate Libraries", url: "#"}
          ]
        }
      };
      return configSlide;
    },

    loadSlide : function() {
      var contentSlide = '<div class="kill-pointer nav" data-id="nav-prime"><nav><div class="list-container shadow" data-id="nav-slide" id="global"><ul><li class="trigger-container"><div class="menu-trigger-container"><a href="#" class="menu-trigger main-trigger icon_hamburger" data-trigger="slide"></a></div></li><li class="menu-item selected"><a href="#" class="{{link1.icon}} top-list-item txt-grey">{{link1.displayName}}</a></li><li class="menu-item"><a href="#" data-trigger="sec-nav" data-link="link2" class="{{link2.icon}} txt-grey">{{link2.displayName}}</a></li><li class="menu-item"><a href="#" data-trigger="sec-nav" data-link="link3" class="{{link3.icon}} txt-grey">{{link3.displayName}}</a></li><li class="menu-item"><a href="#" data-trigger="sec-nav" data-link="link4" class="{{link4.icon}} txt-grey">{{link4.displayName}}</a></li><li class="menu-item"><a href="#" data-trigger="sec-nav" data-link="link5" class="{{link5.icon}} txt-grey">{{link5.displayName}}</a></li><li class="menu-item"><a href="#" data-trigger="sec-nav" data-link="link6" class="{{link6.icon}} txt-grey">{{link6.displayName}}</a></li></ul></div><div class="list-container" id="secondary" data-id="nav-sec"><div class="menu-trigger-container last"><a href="#" class="menu-trigger main-trigger icon_hamburger" data-trigger="slide"></a></div><div class="trigger-container selected clearfix"><a href="#" class="title h4" data-trigger="sec-close">Main Menu</a></div><ul class="secondary-list" data-js="secondary-list"><li class="menu-item" data-js="display-name"><a href="#" class="top-list-item txt-grey"></a></li></ul></div></nav></div>';
      return contentSlide;
    },

    loadGlobal : function() {
      var contentSlide = '<br><div class="menu-container" data-menu><ul>{{#each this.global}}<li class="{{className}}"><a href="{{url}}"><div></div><p>{{copy}}</p></a></li>{{/each}}<ul></div>';
      return contentSlide;
    }
  };
})();


var GM = (function() {
  'use strict';
  $('[data-target=global]').append('<a class="icon_menu2 txt-grey" data-trigger="global"></a>');
  var dataGlobal = MenusModel.dataGlobal(),
      dataSlide = MenusModel.dataSlide(),
      loadSlide = MenusModel.loadSlide(),
      loadGlobal = MenusModel.loadGlobal(),
      navActive = false,
      $globalTrigger = $('[data-trigger=global]'),
      $slideTrigger = $('[data-trigger=slide]'),
      $searchTrigger = $('[data-trigger=search]'),
      $searchContainer = $('[data-search]'),
      $template = $('#template'),
      $global,
      $navGlobal,
      $navSlide,
      $navPrime,
      $navSec,
      $dataMask = $('[data-mask]'),
  
    setTemplate = function() {
      var templateSlide = Handlebars.compile(loadSlide),
          templateGlobal = Handlebars.compile(loadGlobal),
          htmlSlide = templateSlide(dataSlide),
          htmlGlobal = templateGlobal(dataGlobal);
      $('[data-target=slide]').append(htmlSlide);
      $('[data-target=global]').append(htmlGlobal);
      setVars();
      setListeners();
      outsideClick();
    },

    setSlideSecondary = function(dataLink) {
      $.each(dataSlide, function(i, el) {
        if (i === dataLink) {
          $('[data-js=display-name] a')
            .html(el.displayName)
            .attr('class', 'top-list-item')
            .attr('class', 'txt-grey')
            .attr('class', el.icon)
            .attr('data-no');
          $('[data-js=sub]').remove();
          $.each(el.subLinks, function(i, elem) {
            $('[data-js=secondary-list]')
              .append('<li class="menu-item sub" data-js="sub">' +
                      '<a href="' + elem.url + '" class="txt-grey">' + elem.dispName + '</a></li>');
          });
        }
      });
    },

    setVars = function() {
      if (/MSIE (\d+\.\d+);/.test(navigator.appVersion)) {
        var ieversion = Number(RegExp.$1);
        if (ieversion > 9) {
           $('body').addClass('all-ie');
        }
      }
      $navGlobal = $('[data-menu]');
      $navSlide = $('[data-id=nav-slide]');
      $navPrime = $('[data-id=nav-prime]');
      $navSec = $('[data-id=nav-sec]');
      $global = $('#global');
    },

    setListeners = function() {
      $('html').on('click touchstart', '[data-trigger]', function(ev) {
        ev.preventDefault();
        var dataId = $(ev.target).data('trigger'),
            dataLink = $(ev.target).data('link'),
            globalOpen = $globalTrigger.hasClass('open'),
            slideOpen = $slideTrigger.hasClass('open'),
            searchOpen = $searchTrigger.hasClass('open');
        switch(dataId) {
          case 'global':
            if (slideOpen || searchOpen) {
              closeSlide();
              closeSearch();
              openGlobal();
            } else {
              (globalOpen) ? closeGlobal() : openGlobal();
              mask();
            }
            break;
          case 'slide':
            if (globalOpen || searchOpen) {
              closeGlobal();
              closeSearch();
              openSlide();
            } else {
              (slideOpen) ? closeSlide() : openSlide();
              mask();
            }
            break;
          case 'sec-nav':
            closeSlideSecondary();
            setSlideSecondary(dataLink);
            break;
          case 'sec-close':
            openSlideSecondary();
            break;
          case 'search':
            if (globalOpen) {
              closeGlobal();
              openSearch();
            } else if (searchOpen) {
               closeSearch();
               mask();
            } else if (slideOpen){
                closeSlide();
                openSearch();
            } else {
              openSearch();
              mask();
            }
            break;
          default:
            break;
        }
      });
    },

    outsideClick = function() {
      $('body').on('click touchstart', '#mask, [data-js=close-search], .search-link, [data-js=sub]', function(ev) {
        ev.stopPropagation();
        if ((!$(ev.target).is('input'))) {
          if (navActive === true) {
            if ($globalTrigger.hasClass('open')) closeGlobal();
            if ($slideTrigger.hasClass('open')) closeSlide();
            if ($searchTrigger.hasClass('open')) closeSearch();
            mask();
          }
        }
      });
      $('body').on('click', function(ev) {
        if ($(ev.target).hasClass('last')) return false;
      });
    },

    openGlobal = function() {
      navActive = true;
      $navGlobal.fadeIn('fast');
      $globalTrigger.addClass('open');
    },

    closeGlobal = function() {
      navActive = false;
      $navGlobal.fadeOut('fast');
      $globalTrigger.removeClass('open');
    },

    openSlide = function() { 
      navActive = true;
      var pageHeight = $('html').height() * 1.25;
      $navPrime
        .fadeIn('fast')
        .animate({right: '0'}, 400)
        .removeClass('kill-pointer')
        .css({
          top: '0',
          height: pageHeight + 'px'
        });
      $template
        .show()
        .animate({right: '0'}, 400);
      $slideTrigger.addClass('open');
    },

    closeSlide = function () {
      navActive = false;
      $navPrime
        .animate({right: '-310px'}, 400)
        .addClass('kill-pointer')
        .fadeOut('fast');
      $template
        .animate({right: '-440px'}, 400)
        .hide('slow')
      $slideTrigger.removeClass('open');
      openSlideSecondary();
    },

    openSlideSecondary = function () {
      $global.show('fast');
      $navSlide
        .animate({right: '0'}, 400)
        .removeClass('kill-pointer');
      setTimeout(function() {
        $navSec.removeClass('shadow');
      }, 440);
    },

    closeSlideSecondary = function () {
      $global.hide('slow');
      $navSlide
        .animate({right: '-310px'}, 400)
        .addClass('kill-pointer');
      $navSec.addClass('shadow');
    },

    openSearch = function() {
      navActive = true;
      $searchContainer.fadeIn('fast');
      $searchTrigger.addClass('open');
    },

    closeSearch = function() {
      navActive = false;
      $searchContainer.fadeOut('fast');
      $searchTrigger.removeClass('open');
    },

    mask = function() {
      if ($dataMask.hasClass('invisible')) {
        if ($('body').hasClass('ie-8')) {
          $dataMask.removeClass('invisible');
        } else {
          $dataMask.fadeIn('fast').removeClass('invisible');
        }
      } else {
        if ($('body').hasClass('ie-8')) {
          $dataMask.addClass('invisible');
        } else {
          $dataMask.fadeOut('fast').addClass('invisible');
        }
      }
    };

  return {
    init : function() {
      setTemplate();
    }
  };

})();
$( window ).load(function() { GM.init(); });

