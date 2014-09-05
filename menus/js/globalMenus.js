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
        link2: {displayName: "Collaboration", icon: "icon_project",
            subLinks: [
              {dispName: "Business Unit Teams", url: "#"},
              {dispName: "Projects", url: "#"},
              {dispName: "Communities", url: "#"}
            ]
          },
        link3: {displayName: "Employee Center", icon: "icon_person",
            subLinks: [
              {dispName: "Benefits/Health", url: "#"},
              {dispName: "Employment/Corp.", url: "#"},
              {dispName: "Orientation/Training", url: "#"},
              {dispName: "Work/Life", url: "#"}
            ]
          },
        link4: {displayName: "Workplace Services", icon: "icon_work",
            subLinks: [
              {dispName: "Technology/Services", url: "#"},
              {dispName: "Order/Reserve", url: "#"},
              {dispName: "Job Aids/Templates", url: "#"},
              {dispName: "Facilities/Locations", url: "#"}
            ]
          },
        link5: {displayName: "Company", icon: "icon_company",
          subLinks: [
            {dispName: "News & Culture", url: "#"},
            {dispName: "Leadership", url: "#"},
            {dispName: "About Business Units", url: "#"}
          ]
        }
      };
      return configSlide;
    },

    loadSlide : function() {
      var contentSlide = '<div class="kill-pointer nav" data-id="nav-prime" data-no><nav data-no><div class="list-container shadow" data-id="nav-slide" id="global" data-no><ul data-no><li data-no class="trigger-container"><div class="menu-trigger-container"><a href="#" class="menu-trigger main-trigger icon_hamburger" data-trigger="slide" data-no></a></div></li><li class="menu-item selected" data-no><a href="#" class="{{link1.icon}} top-list-item txt-grey" data-no>{{link1.displayName}}</a></li><li class="menu-item" data-no><a href="#" data-trigger="sec-nav" data-link="link2" class="{{link2.icon}} txt-grey" data-no>{{link2.displayName}}</a></li><li class="menu-item" data-no><a href="#" data-trigger="sec-nav" data-link="link3" class="{{link3.icon}} txt-grey" data-no>{{link3.displayName}}</a></li><li class="menu-item" data-no><a href="#" data-trigger="sec-nav" data-link="link4" class="{{link4.icon}} txt-grey" data-no>{{link4.displayName}}</a></li><li class="menu-item" data-no><a href="#" data-trigger="sec-nav" data-link="link5" class="{{link5.icon}} txt-grey" data-no>{{link5.displayName}}</a></li></ul></div><div class="list-container" id="secondary" data-id="nav-sec" data-no><div class="trigger-container clearfix" data-no><a href="#" data-trigger="sec-close" class="title h4" data-no>Main Menu</a><div class="menu-trigger-container last"><a href="#" class="menu-trigger main-trigger icon_hamburger" data-trigger="slide"></a></div></div><ul class="secondary-list" data-js="secondary-list"><li class="menu-item" data-js="display-name"><a href="#" class="top-list-item txt-grey"></a></li></ul></div></nav></div>';
      return contentSlide;
    },

    loadGlobal : function() {
      var contentSlide = '<br><div class="menu-container" data-menu data-no><ul data-no>{{#each this.global}}<li class="{{className}}" data-no><a href="{{url}}"><div></div><p>{{copy}}</p></a></li>{{/each}}<ul></div>';
      return contentSlide;
    }
  };
})();


var GM = (function() {
  'use strict';
  $('[data-menus]').before('<script src="//wurfl.io/wurfl.js"></script>');
  $('[data-trigger=slide]').after('<div data-target="slide" id="template"></div>');
  $('[data-target=global]').append('<a class="icon_menu2 txt-grey" data-trigger="global" data-no></a>');
  $('body').append('<div id="mask" data-mask class="invisible">');
  var dataGlobal = MenusModel.dataGlobal(),
      dataSlide = MenusModel.dataSlide(),
      loadSlide = MenusModel.loadSlide(),
      loadGlobal = MenusModel.loadGlobal(),
      navActive = false,
      $globalTrigger = $('[data-trigger=global]'),
      $slideTrigger = $('[data-trigger=slide]'),
      $searchTrigger = $('[data-trigger=search]'),
      $searchContainer = $('[data-search]'),
      $navGlobal,
      $navSlide,
      $navPrime,
      $navSec,
      $dataMask = $('[data-mask]');
  return {
    setTemplate : function() {
      var templateSlide = Handlebars.compile(loadSlide),
          templateGlobal = Handlebars.compile(loadGlobal),
          htmlSlide = templateSlide(dataSlide),
          htmlGlobal = templateGlobal(dataGlobal);
      $('[data-target=slide]').append(htmlSlide);
      $('[data-target=global]').append(htmlGlobal);
      GM.setVars();
      GM.setListeners();
      GM.outsideClick();
    },

    setSlideSecondary : function(dataLink) {
      $.each(dataSlide, function(i, el) {
        if (i === dataLink) {
          $('[data-js=display-name] a')
            .html(el.displayName)
            .attr('class', 'top-list-item')
            .attr('class', 'txt-grey')
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

    setVars : function() {
      if (/MSIE (\d+\.\d+);/.test(navigator.appVersion)) {
        var ieversion = Number(RegExp.$1);
        $('html').addClass('all-ie');
        if (ieversion === 8) {
           $('html').addClass('ie-8');
        }
      } else {
        if ((WURFL.form_factor === 'Smartphone') || (WURFL.form_factor === 'Tablet')) $('html').addClass('hh');
      }
      $navGlobal = $('[data-menu]');
      $navSlide = $('[data-id=nav-slide]');
      $navPrime = $('[data-id=nav-prime]');
      $navSec = $('[data-id=nav-sec]');
    },

    setListeners : function() {
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
              GM.closeSlide();
              GM.closeSearch();
              GM.openGlobal();
            } else {
              (globalOpen) ? GM.closeGlobal() : GM.openGlobal();
              GM.mask();
            }
            break;
          case 'slide':
            if (globalOpen || searchOpen) {
              GM.closeGlobal();
              GM.closeSearch();
              GM.openSlide();
            } else {
              (slideOpen) ? GM.closeSlide() : GM.openSlide();
              GM.mask();
            }
            break;
          case 'sec-nav':
            GM.closeSlideSecondary();
            GM.setSlideSecondary(dataLink);
            break;
          case 'sec-close':
            GM.openSlideSecondary();
            break;
          case 'search':
            if (globalOpen) {
              GM.closeGlobal();
              GM.openSearch();
            } else {
              (searchOpen) ? GM.closeSearch() : GM.openSearch();
              GM.mask();
            }
            break;
          default:
            break;
        }
      });
    },

    outsideClick : function() {
      $('html').on('click touchstart', function(ev) {
        ev.stopPropagation();
        if ((!$(ev.target).is('[data-no]')) &&
            (!$(ev.target).is('#SearchBox input')) &&
            (!$(ev.target).is('#SearchBox #searchImg')) &&
            (!$(ev.target).is('#SearchBox'))) {
          if (navActive === true) {
            if ($globalTrigger.hasClass('open')) GM.closeGlobal();
            if ($slideTrigger.hasClass('open')) GM.closeSlide();
            if ($searchTrigger.hasClass('open')) GM.closeSearch();
            GM.mask();
          }
        }
      });
    },

    openGlobal : function() {
      navActive = true;
      $navGlobal.fadeIn('fast');
      $globalTrigger.addClass('open');
    },

    closeGlobal : function() {
      navActive = false;
      $navGlobal.fadeOut('fast');
      $globalTrigger.removeClass('open');
    },

    openSlide : function() { 
      navActive = true;
      var pageHeight = $('html').height() * 1.25;
      $navPrime
        .animate({left: '310px'}, 400)
        .removeClass('kill-pointer')
        .css({
          top: '0',
          height: pageHeight + 'px'
        });
      $slideTrigger.addClass('open');
    },

    closeSlide : function () {
      navActive = false;
      $navPrime
        .animate({left: '-310px'}, 400)
        .addClass('kill-pointer');
      $slideTrigger.removeClass('open');
      GM.openSlideSecondary();
    },

    openSlideSecondary : function () {
      $navSlide
        .animate({left: '0'}, 400)
        .removeClass('kill-pointer');
      setTimeout(function() {
        $navSec.removeClass('shadow');
      }, 440);
    },

    closeSlideSecondary : function () {
      $navSlide
        .animate({left: '-310px'}, 400)
        .addClass('kill-pointer');
      $navSec.addClass('shadow');
    },

    openSearch : function() {
      navActive = true;
      $searchContainer.fadeIn('fast');
      $searchTrigger.addClass('open');
    },

    closeSearch : function() {
      navActive = false;
      $searchContainer.fadeOut('fast');
      $searchTrigger.removeClass('open');
    },

    mask : function() {
      ($dataMask.hasClass('invisible')) ? $dataMask.fadeIn('fast').removeClass('invisible') : $dataMask.fadeOut('fast').addClass('invisible');
    },

    init : function() {
      GM.setTemplate();
    }
  };
})();
$( window ).load(function() { GM.init(); });

