var MenusModel = (function () {
        'use strict';
        var _globalData = [],
            _globalCopy = [],
            _globalHref = [],
            _globalBlank = [],
            _globalImage = [],
            _leftData = [],
            viewAll = false,
            globalSet = false;
        return {
            postGlobalApps: function () {
                $().SPServices({
                    operation: "GetListItems",
                    async: true,
                    listName: "Global Apps",
                    CAMLViewFields: "<ViewFields><FieldRef Name='Title' /><FieldRef Name='URL' /><FieldRef Name='RHLaunchNewWindow' /><FieldRef Name='RHImage' /></ViewFields>",
                    CAMLQuery: "<Query><Where><Eq><FieldRef Name='RHCBusinessUnit' /><Value Type='TaxonomyFieldTypeMulti'>" + personProperties.BusinessUnit + "</Value></Eq></Where><OrderBy><FieldRef Name='SortOrder' /></OrderBy></Query>",
                    webURL: _contextPath,
                    completefunc: function (xData, Status) {
                        var rows = $(xData.responseText).find('[ows_Title]'),
                            innerObj = {};
                        $.each(rows, function (i, el) {
                            var title = $(el).attr('ows_title'),
                                window = $(el).attr('ows_rhlaunchnewwindow'),
                                url = $(el).attr('ows_url').split(",")[0],
                                image = $(el).attr('ows_rhimage');
                            innerObj = { Title: title, URL: url, Image: image, RHLaunchNewWindow: window };
                            _globalData.push(innerObj);
                        });
                        MenusModel.setGlobalData(_globalData);
                    }
                });
            },

            setGlobalData: function (_globalData) {
                $.each(_globalData, function (i, el) {
                    if (i <= 8) {
                        _globalCopy.push(el.Title);
                        _globalHref.push(el.URL);
                        _globalImage.push(el.Image);
                        (el.RHLaunchNewWindow) ? _globalBlank.push('_blank') : _globalBlank.push('_self');
                    }
                    if (i >= 9) viewAll = true;
                });
                $('[data-trigger=global]').removeClass('no-pointer');
            },

            setGlobalView: function() {                        
                if (!globalSet) {                   
                    $('[data-target=global]')
                        .find('[data-link]')
                        .each(function (i, el) {
                            if (i <= 8) {
                                $(el)
                                    .attr('href', _globalHref[i])
                                    .attr('target', _globalBlank[i]);
                            }
                        })
                        .end()
                            .find('[data-copy]')
                            .each(function (i, el) {
                                var globCopy = (_globalCopy[i] == "You") ? "+You" : _globalCopy[i];
                                if (i <= 8) {
                                    $(el).text(globCopy);
                                }
                            });

                    $.each(_globalHref, function (i, el) {
                        if (i === 9) {
                            $('[data-target=global]').find('ul').append('<li><a class="global-view-all txt-grey" data-view-all href="' + _contextPath + '"/Pages/View-All-Global-Apps.aspx">VIEW ALL</a></li>');
                        }
                    });
                    globalSet = true;
                }
            },

            dataGlobal: function () {
                var configGlobal = {
                    global: [
                      { className: "person", copy: "+You", url: "#" },
                      { className: "directory", copy: "Directory", url: "#" },
                      { className: "time", copy: "Time Entry", url: "#" },
                      { className: "pay", copy: "Payroll", url: "#" },
                      { className: "travel", copy: "Travel", url: "#" },
                      { className: "itSc", copy: "IT SC", url: "#" },
                      { className: "holiday", copy: "Holidays", url: "#" }
                    ]
                };
                return configGlobal;
            },

            postLeftSlide: function() {
                var leftCaml = "<Query><Where><And><Or><Or><Eq><FieldRef Name='RHCompanyLoc' /><Value Type='TaxonomyFieldTypeMulti'>" + personProperties.CountryCompany + "</Value></Eq>";
                leftCaml += "<Eq><FieldRef Name='RHCompanyLoc' /><Value Type='TaxonomyFieldTypeMulti'>" + personProperties.Location + "</Value></Eq></Or><IsNull><FieldRef Name='RHCompanyLoc'></FieldRef></IsNull>";
                leftCaml += "</Or><Eq><FieldRef Name='RHCBusinessUnit' /><Value Type='TaxonomyFieldTypeMulti'>" + personProperties.BusinessUnit + "</Value></Eq></And></Where></Query>";
                $().SPServices({
                    operation: "GetListItems",
                    async: true,
                    listName: "RHGlobalNav",
                    CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='RHL1Title' /><FieldRef Name='RHSortOrder0' /><FieldRef Name='Title' /><FieldRef Name='URL' /><FieldRef Name='RHSortOrder0' /><FieldRef Name='RHParentID' /></ViewFields>",
                    CAMLQuery: leftCaml,
                    webURL: _contextPath,
                    completefunc: function (xData, Status) {
                        var rows = $(xData.responseText).find('[ows_Title]'),
                            innerObj = {};
                        $.each(rows, function (i, el) {
                            var title = $(el).attr('ows_title'),
                                elId = $(el).attr('ows_id'),
                                parId = $(el).attr('ows_rhparentid'),
                                sort = $(el).attr('ows_rhsortorder0'),
                                url = ($(el).attr('ows_url')) ? $(el).attr('ows_url').split(",")[0] : '';
                            innerObj = { Title: title, ElId: parseInt(elId), ParId: parseInt(parId), URL: url, Sort: parseInt(sort) };
                            _leftData.push(innerObj);
                        });
                        $('[data-trigger=slide]').removeClass('no-pointer');
                    }
                });
            },

            setLeftView: function() {                
                _leftData.sort(function (a, b) {
                    return a.Sort - b.Sort
                });
                $('[data-id=nav-slide]')
                    .find('[data-link]')
                    .each(function (i, el) {
                        $(el).text(_leftData[i].Title);
                    });
                $('a.icon_home').attr('href', _contextPath);
                $('[data-id=nav-slide]').find('.selected').on('click', function () {
                    window.location.href = _contextPath;
                });
            },

            setLeftSecData: function(selector) {                
                var parentId,
                    setTopLink = function () {
                        $.each(_leftData, function (i, el) {
                            if ((i <= 3) && (selector === el.Title)) {
                                $('[data-sec]')
                                   .first()
                                   .attr('href', el.URL)
                                   .html(el.Title);
                                parentId = el.ElId;
                            }
                        });
                    };
                $.when(setTopLink())
                    .always(MenusModel.setLeftSecView(parentId, selector));                    
            },

            setLeftSecView: function(parentId, selector) {
                var secArr = [];
                $.each(_leftData, function (i, el) {
                    var secObj = {};
                    if (i >= 4) {
                        if (el.ParId == parentId) {
                            secObj = { Title: el.Title, URL: el.URL }
                            secArr.push(secObj);                            
                        }
                    }
                });

                var setSec = function () {
                    $('[data-js=secondary-list]')
                        .find('[data-js=sub]')
                        .each(function (i, el) {
                            var url = (secArr[i]) ? secArr[i].URL : '',
                                title = (secArr[i]) ? secArr[i].Title : '';
                            if (url && title) {
                                $(el).append('<a href="' + url + '" class="txt-grey">' + title + '</a>');
                            } else if (!title && !url) {
                                $(el).remove();
                            } else if (title && !url) {
                                $(el).append('<a href="#" class="txt-grey">' + title + '!url</a>');
                            }
                        });
                    },
                    setCompany = function (selector) {
                        $('[data-js=secondary-list] li').first().addClass('first');
                        var href = $('[data-js=secondary-list] li.first a').attr('href');
                        $('[data-js=secondary-list] li.first a').attr('href', href.toLowerCase().replace("rh", personProperties.BusinessUnit));
                        $('[data-js=secondary-list]').find('[data-js=sub] a').each(function (i, el) {
                            var href = $(el).attr('href');
                            $(el).attr('href', href.toLowerCase().replace("rh", personProperties.BusinessUnit));                               
                        });
                    };

                $.when(setSec())
                    .always(setCompany(selector));

            },

            dataSlide: function () {
                var configSlide = {
                    link1: { displayName: "home", icon: "icon_home" },
                    link2: {
                        displayName: "Collaboration", icon: "icon_project",
                        subLinks: [
                          { dispName: "My Teams", url: "#" },
                          { dispName: "Projects", url: "#" },
                          { dispName: "Communities", url: "#" }
                        ]
                    },                    
                    link3: {
                        displayName: "Employee Center", icon: "icon_person",
                        subLinks: [
                          { dispName: "Benefits/Health", url: "#" },
                          { dispName: "Employment/Comp.", url: "#" },
                          { dispName: "Orientation/Training", url: "#" },
                          { dispName: "Work/Life", url: "#" }
                        ]
                    },
                    link4: {
                        displayName: "Workplace Services", icon: "icon_work",
                        subLinks: [
                          { dispName: "Technology/Services", url: "#" },
                          { dispName: "Order/Reserve", url: "#" },
                          { dispName: "Job Aids/Templates", url: "#" },
                          { dispName: "Facilities/Locations", url: "#" }
                        ]
                    },
                    link5: {
                        displayName: "Company", icon: "icon_company",
                        subLinks: [
                          { dispName: "News & Culture", url: "#" },
                          { dispName: "Leadership", url: "#" },
                          { dispName: "About Business Units", url: "#" }
                        ]
                    }
                };
                return configSlide;
            },

            loadSlide: function () {
                var contentSlide = '<div class="kill-pointer nav" data-id="nav-prime"><nav><div class="list-container shadow" data-id="nav-slide" id="global"><ul><li class="trigger-container"><div class="menu-trigger-container"><a href="#" class="menu-trigger main-trigger icon_hamburger" data-trigger="slide"></a></div></li><li class="menu-item selected"><a href="#" class="{{link1.icon}} top-list-item txt-grey">{{link1.displayName}}</a></li><li class="menu-item"><a href="#" data-trigger="sec-nav" data-link="link2" class="{{link2.icon}} txt-grey">{{link2.displayName}}</a></li><li class="menu-item"><a href="#" data-trigger="sec-nav" data-link="link3" class="{{link3.icon}} txt-grey">{{link3.displayName}}</a></li><li class="menu-item"><a href="#" data-trigger="sec-nav" data-link="link4" class="{{link4.icon}} txt-grey">{{link4.displayName}}</a></li><li class="menu-item"><a href="#" data-trigger="sec-nav" data-link="link5" class="{{link5.icon}} txt-grey">{{link5.displayName}}</a></li></ul></div><div class="list-container" id="secondary" data-id="nav-sec"><div class="trigger-container clearfix"><a href="#" data-trigger="sec-close" class="title h4">Main Menu</a><div class="menu-trigger-container last"><a href="#" class="menu-trigger main-trigger icon_hamburger" data-trigger="slide"></a></div></div><ul class="secondary-list" data-js="secondary-list"><li class="menu-item" data-js="display-name"><a href="#" class="top-list-item txt-grey" data-sec></a></li></ul></div></nav></div>';
                return contentSlide;
            },

            loadGlobal: function () {
                var contentGlobal = '<br><div class="menu-container clearfix" data-menu><ul>{{#each this.global}}<li class="{{className}}"><a href="{{url}}" data-link><div></div><p class="txt-grey-mid" data-copy>{{copy}}</p></a></li>{{/each}}<ul></div>';
                return contentGlobal;
            }
        };
    })(),

GM = (function () {
    'use strict';
    $('[data-trigger=slide]').after('<div data-target="slide" id="template"></div>');
    $('[data-target=global]').append('<a class="icon_menu2 txt-grey no-pointer" data-trigger="global"></a>');
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
        setTemplate: function () {
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

        setSlideSecondary: function (dataLink) {
            $.each(dataSlide, function (i, el) {
                if (i === dataLink) {
                    $('[data-js=display-name] a')
                      .attr('class', 'top-list-item')
                      .attr('class', 'txt-grey');
                    $('[data-js=sub]').remove();
                    $.each(el.subLinks, function (i, elem) {
                        $('[data-js=secondary-list]')
                          .append('<li class="menu-item sub" data-js="sub"></li>');
                    });
                }
            });
        },

        setVars: function () {
            $navGlobal = $('[data-menu]');
            $navSlide = $('[data-id=nav-slide]');
            $navPrime = $('[data-id=nav-prime]');
            $navSec = $('[data-id=nav-sec]');
        },

        setListeners: function () {
            $('html').on('click touchstart', '[data-trigger]', function (ev) {                   
                ev.preventDefault();
                var dataId = $(ev.target).data('trigger'),
                    dataLink = $(ev.target).data('link'),
                    globalOpen = $globalTrigger.hasClass('open'),
                    slideOpen = $slideTrigger.hasClass('open'),
                    searchOpen = $searchTrigger.hasClass('open'),
                    selector = $(ev.target).text();
                switch (dataId) {
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
                        GM.closeSlideSecondary(selector);
                        $.when(GM.setSlideSecondary(dataLink))
                            .always(MenusModel.setLeftSecData(selector));
                        break;
                    case 'sec-close':
                        GM.openSlideSecondary();
                        break;
                    case 'search':
                        if (globalOpen) {
                            GM.closeGlobal();
                            GM.openSearch();
                            GM.mask();
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

        outsideClick: function () {
            $('body').on('click touchstart', '#mask, [data-js=close-search]',  function (ev) {
                ev.stopPropagation();
                if ((!$(ev.target).is('#SearchBox input')) &&
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

        openGlobal: function () {
            navActive = true;
            $dataMask.css('opacity', '0');
            $navGlobal.fadeIn('fast');
            MenusModel.setGlobalView();
            $globalTrigger.addClass('open');
        },

        closeGlobal: function () {
            navActive = false;
            $navGlobal.fadeOut('fast');
            $globalTrigger.removeClass('open');
        },

        openSlide: function () {
            navActive = true;
            $dataMask.css('opacity', '.7');
            var pageHeight = $('html').height() * 1.25;
            $navPrime
              .animate({ left: '310px' }, 400)
              .removeClass('kill-pointer')
              .css({
                  top: '0',
                  height: pageHeight + 'px'
              });
            MenusModel.setLeftView();
            $slideTrigger.addClass('open');
        },

        closeSlide: function () {
            navActive = false;
            $navPrime
              .animate({ left: '-310px' }, 400)
              .addClass('kill-pointer');
            $slideTrigger.removeClass('open');
            GM.openSlideSecondary();
        },

        openSlideSecondary: function () {
            $navSlide
              .animate({ left: '0' }, 400)
              .removeClass('kill-pointer');
            setTimeout(function () {
                $navSec.removeClass('shadow');
            }, 440);            
        },

        closeSlideSecondary: function (selector) {
            $navSlide
              .animate({ left: '-310px' }, 400)
              .addClass('kill-pointer');
            $navSec.addClass('shadow');
            
        },

        openSearch: function () {
            navActive = true;
            $dataMask.css('opacity', '0');
            $searchContainer.fadeIn('fast');
            $searchTrigger.addClass('open');
        },

        closeSearch: function () {
            navActive = false;
            $searchContainer.fadeOut('fast');
            $searchTrigger.removeClass('open');
        },

        mask: function () {
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
        }
    };
})(),

GNav = (function () {
    'use strict';
    var dataArr = [],
        url,
        type;
    return {
        setURL: function () {
            var path = (window.location.pathname.split('/')[1]) ? window.location.pathname.split('/')[1].toLowerCase() : '/';
            path = (/pages\/collaboration-/.test(self.location.href.toLowerCase())) ? "collaboration" : path;
            path = (/pages\/projects/.test(self.location.href.toLowerCase())) ? "collaboration" : path;
            path = (/pages\/communities/.test(self.location.href.toLowerCase())) ? "collaboration" : path;
            path = (/hometest.aspx$/.test(self.location.href.toLowerCase())) ? '/' : path;
            path = (/.com\/pages\/home.aspx$/.test(self.location.href.toLowerCase())) ? '/' : path;
            path = (/.com\/Pages\/home.aspx$/.test(self.location.href.toLowerCase())) ? '/' : path;

            $().SPServices({
                operation: "GetListItems",
                async: true,
                listName: "RHGlobalNav",
                CAMLViewFields: "<ViewFields><FieldRef Name='ID' /><FieldRef Name='RHL1Title' /><FieldRef Name='RHSortOrder0' /><FieldRef Name='Title' /><FieldRef Name='URL' /><FieldRef Name='RHSortOrder0' /><FieldRef Name='RHParentID' /><FieldRef Name='RHL1TitleUrl' /></ViewFields>",
                CAMLQuery: "<Query><Where><And><And><Or><Or><Eq><FieldRef Name='RHCompanyLoc' /><Value Type='TaxonomyFieldTypeMulti'>" + personProperties.CountryCompany + "</Value></Eq><Eq><FieldRef Name='RHCompanyLoc' /><Value Type='TaxonomyFieldTypeMulti'>" + personProperties.Location + "</Value></Eq></Or><IsNull><FieldRef Name='RHCompanyLoc'></FieldRef></IsNull></Or><Eq><FieldRef Name='RHCBusinessUnit' /><Value Type='TaxonomyFieldTypeMulti'>" + personProperties.BusinessUnit + "</Value></Eq></And><Eq><FieldRef Name='RoutingTargetPath' /><Value Type='Text'>" + path + "</Value></Eq></And></Where><OrderBy><FieldRef Name='RHSortOrder' /></OrderBy></Query>",
                webURL: _contextPath,
                completefunc: function (xData, Status) {
                        var rows = $(xData.responseText).find('[ows_Title]');
                        $.each(rows, function (i, el) {
                            var newObj = { Title: $(el).attr('ows_title'), URL: ($(el).attr('ows_url')) ? $(el).attr('ows_url').split(",")[0] : "", L1Title: $(el).attr('ows_rhl1title'), L1Url: ($(el).attr('ows_rhl1titleurl')) ? $(el).attr('ows_rhl1titleurl').split(",")[0] : "" };
                            dataArr.push(newObj);
                        });
                        console.log('path ' + path)
                        $.when(GNav.setTemplate(dataArr, path))
                            .always(function () {
                                GNav.setHome();
                                if (path && path.toLowerCase() === "company") GNav.setCompany();
                            });
                    }
                });         
        },

        globalNavContent: function () {
            var content = '<div class="row"><div class="small-21 columns align-center"><ul class="nav-upper-list no-bullet text-center" data-loop>{{#each this}}<li><a href="{{URL}}" class="txt-grey-dark" data-link>{{Title}}</a></li>{{/each}}</ul></div></div>';
            return content;
        },

        setHome: function() {
            $('[data-loop]').find('[data-link]').each(function (i, el) {
                var href = $(el).attr('href');
                $(el).attr('href', href.toLowerCase().replace("rh", personProperties.BusinessUnit));
            });
        },

        setCompany: function () {           
            $('[data-loop]').find('[data-link]').each(function (i, el) {
                if (/company/.test($(el).attr('href').toLowerCase())) {
                        
                    if (/company/.test(self.location.href.toLowerCase())) {
                        if (window.location.pathname.split('/').length > 2) {
                            var currentBUPath = window.location.pathname.split('/')[2].toLowerCase();
                            if (personProperties.BusinessUnit.toLowerCase() != currentBUPath.toLowerCase()) {

                                //If current user's BU is same as Current site, keep BU
                                var currUrl = $(el).attr('href'),
                                    coNewUrl = currUrl.toLowerCase().replace("rh", currentBUPath);
                                coNewUrl = currUrl.toLowerCase().replace(personProperties.BusinessUnit.toLowerCase(), currentBUPath)
                            }
                        }
                    }                        
                    $(el).attr('href', coNewUrl);
                }                   
            });
        },

        setTemplate: function (dataArr, type) {
            var template = Handlebars.compile(GNav.globalNavContent()),
                html = template(dataArr);
            $('[data-globalNav]').append(html);
            if (dataArr && dataArr.length > 0) {
                var title = dataArr[0].L1Title,
                    l1titleurl = dataArr[0].L1Url,
                    currentBUPath,
                    newL1Url = "";

                //for home page
                currentBUPath = (window.location.pathname.split('/')[2]) ? window.location.pathname.split('/')[2].toLowerCase() : personProperties.BusinessUnit;
                if (l1titleurl) { newL1Url = l1titleurl.toLowerCase().replace("rh", personProperties.BusinessUnit); }

                //for all but home
                if (title) $('[data-l1]').html('<a href="' + newL1Url + '">' + title + '</a>');
            }
        }
    };
})();
$('html').on('propertiesLoaded', function () {
    GNav.setURL();
    GM.setTemplate();
    MenusModel.postGlobalApps();
    MenusModel.postLeftSlide();
});
