var MenusModel = (function() {
  'use strict';
 //  // 1 ajax calls returns user data
 //    // plug into BU indicator (TODO build control for that)
  
 //  // userd data from url to 2nd ajax gets globalConfig

 // // 3rd ajax for employee center urls
 
 // //data loop 
 // globalConfig.global.url = data.person.url
 // var _getList = function(url) {

 // }
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
      var contentSlide = '<div class="kill-pointer nav" data-id="nav-prime" data-no><nav data-no><div class="list-container shadow" data-id="nav-slide" id="global" data-no><ul data-no><li data-no class="trigger-container"><div class="menu-trigger-container"><a href="#" class="menu-trigger main-trigger icon_hamburger" data-trigger="slide" data-no></a></div></li><li class="menu-item selected" data-no><a href="#" class="{{link1.icon}} top-list-item" data-no>{{link1.displayName}}</a></li><li class="menu-item" data-no><a href="#" data-trigger="sec-nav" data-link="link2" class="{{link2.icon}}" data-no>{{link2.displayName}}</a></li><li class="menu-item" data-no><a href="#" data-trigger="sec-nav" data-link="link3" class="{{link3.icon}}" data-no>{{link3.displayName}}</a></li><li class="menu-item" data-no><a href="#" data-trigger="sec-nav" data-link="link4" class="{{link4.icon}}" data-no>{{link4.displayName}}</a></li><li class="menu-item" data-no><a href="#" data-trigger="sec-nav" data-link="link5" class="{{link5.icon}}" data-no>{{link5.displayName}}</a></li></ul></div><div class="list-container" id="secondary" data-id="nav-sec" data-no><div class="trigger-container" data-no><a href="#" data-trigger="sec-close" class="title h4" data-no>Main Menu</a><div class="menu-trigger-container last"><a href="#" class="menu-trigger main-trigger icon_hamburger" data-trigger="slide"></a></div></div><ul class="secondary-list" data-js="secondary-list"><li class="menu-item" data-js="display-name"><a href="#" class="top-list-item"></a></li></ul></div></nav></div>';
      return contentSlide;
    },

    loadGlobal : function() {
      var contentSlide = '<br><div class="menu-container" data-menu data-no><ul data-no>{{#each this.global}}<li class="{{className}}" data-no><a href="{{url}}"><div></div><p>{{copy}}</p></a></li>{{/each}}<ul></div>';
      return contentSlide;
    }
  };
})();


var GlobalMenus = (function() {
  'use strict';
  $('[data-menus]').before('<script src="//wurfl.io/wurfl.js"></script><script src="js/vendor/handlebars.js"></script>');
  $('[data-trigger=slide]').after('<div data-target="slide" id="template"></div>');
  $('[data-target=global]').append('<a class="icon_menu2" data-trigger="global" data-no></a>');
  $('body').append('<div id="mask" data-mask class="invisible">');
  var dataGlobal = MenusModel.dataGlobal(),
      dataSlide = MenusModel.dataSlide(),
      loadSlide = MenusModel.loadSlide(),
      loadGlobal = MenusModel.loadGlobal(),
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
      this.setVars();
      this.setListeners();
      this.outsideClick();
    },

    setSlideSecondary : function(dataLink) {
      $.each(dataSlide, function(i, el) {
        if (i === dataLink) {
          $('[data-js=display-name] a')
            .html(el.displayName)
            .attr('class', 'top-list-item')
            .attr('data-no');
          $('[data-js=sub]').remove();
          $.each(el.subLinks, function(i, elem) {
            $('[data-js=secondary-list]')
              .append('<li class="menu-item sub" data-js="sub">' +
                      '<a href="' + elem.url + '">' + elem.dispName + '</a></li>');
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
      var _this = this;
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
              _this.closeSlide();
              _this.closeSearch();
              _this.openGlobal();
            } else {
              (globalOpen) ? _this.closeGlobal() : _this.openGlobal();
              _this.mask();
            }
            break;
          case 'slide':
            if (globalOpen || searchOpen) {
              _this.closeGlobal();
              _this.closeSearch();
              _this.openSlide();
            } else {
              (slideOpen) ? _this.closeSlide() : _this.openSlide();
              _this.mask();
            }
            break;
          case 'sec-nav':
            _this.closeSlidePrimary();
            _this.setSlideSecondary(dataLink);
            break;
          case 'sec-close':
            _this.openSlidePrimary();
            break;
          case 'search':
            if (globalOpen) {
              _this.closeGlobal();
              _this.openSearch();
            } else {
              (searchOpen) ? _this.closeSearch() : _this.openSearch();
              _this.mask();
            }
            break;
          default:
            break;
        }
      });
    },

    outsideClick : function() {
      var _this = this;
      $('html').on('click touchstart', function(ev) {
        ev.stopPropagation();
        if (!$(ev.target).is('[data-no]')) {
          if ($globalTrigger.hasClass('open')) _this.closeGlobal();
          if ($slideTrigger.hasClass('open')) _this.closeSlide();
          if ($searchTrigger.hasClass('open')) _this.closeSearch();
          _this.mask();
        }
      });
    },

    openGlobal : function() {
      $navGlobal.fadeIn('fast');
      $globalTrigger.addClass('open');
    },

    closeGlobal : function() {
      $navGlobal.fadeOut('fast');
      $globalTrigger.removeClass('open');
    },

    openSlide : function() {  
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
      $navPrime
        .animate({left: '-310px'}, 400)
        .addClass('kill-pointer');
      $slideTrigger.removeClass('open');
      this.openSlidePrimary();
    },

    openSlidePrimary : function () {
      $navSlide
        .animate({left: '0'}, 400)
        .removeClass('kill-pointer');
      setTimeout(function() {
        $navSec.removeClass('shadow');
      }, 440);
    },

    openSearch : function() {
      $searchContainer.fadeIn('fast');
      $searchTrigger.addClass('open');
    },

    closeSearch : function() {
      $searchContainer.fadeOut('fast');
      $searchTrigger.removeClass('open');
    },

    closeSlidePrimary : function () {
      $navSlide
        .animate({left: '-310px'}, 400)
        .addClass('kill-pointer');
      $navSec.addClass('shadow');
    },

    mask : function() {
      ($dataMask.hasClass('invisible')) ? $dataMask.fadeIn('slow').removeClass('invisible') : $dataMask.fadeOut('slow').addClass('invisible');
    },

    init : function() {
      this.setTemplate();
    }
  };
})();
window.onload = function() { GlobalMenus.init(); };

