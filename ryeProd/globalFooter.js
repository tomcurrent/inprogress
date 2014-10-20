var GF = (function () {
    'use strict';
    var footerArr = [],
        sessionFooter = window.sessionStorage.getItem('footer');
    return {
        getData: function () {
            if (!sessionFooter) {
                var footerURL = _contextPath + "/_api/web/lists/GetByTitle('Footer%20Links')/items"
                $.ajax({
                    url: footerURL,
                    method: 'GET',
                    headers: { 'Accept': 'application/json; odata=verbose' },
                    success: function (data) {
                        GF.buildURL(data);
                    },
                    error: function (jqxhr) {
                        console.log(jqxhr.statusText);
                    }
                });
            } else {
                footerArr = sessionFooter.split(",");
                $('body').on('loaded', function () {
                    GF.setData();
                });
            }
        },

        buildURL: function(data) {           
            var dataArr = data.d.results;
            $.each(dataArr, function (i, el) {
                footerArr.push(el.URL.Url);
                if (i === 6) GF.setData();
            });               
        },

        setData: function() {
            var $dataFooter = $('[data-footer]');
            $dataFooter.find('[data-link]').each(function (i, el) {
                if ((i <= 3) || (i === 5)) {
                    $(el).attr('href', footerArr[i]);
                }
                if (i === 4) $(el).attr('href', footerArr[6]);
                if (i === 6) $(el).attr('href', footerArr[4]);
            });
            window.sessionStorage.setItem('footer', footerArr);
        },

        footerModel: function () {
            var data = {
                topMenu: [
                  { copy: "Ethics Hotline", topUrl: "#" },
                  { copy: "IT Service Center", topUrl: "#" },
                  { copy: "Terms & Conditions", topUrl: "#" }
                ],
                bottomMenu: [
                  { name: "reyesHolding", addClass: "foot-logoreyhldngs txt-grey", bottomUrl: "#" },
                  { name: "reyesBev", addClass: "foot-logorbg txt-grey", bottomUrl: "#" },
                  { name: "mb", addClass: "foot-logombsimple txt-grey", bottomUrl: "#" },
                  { name: "reinheart", addClass: "foot-logorfs txt-grey", bottomUrl: "#" }                 
                ]
            }
            return data;
        },

        footerContent: function () {
            var content = '<div><div class="row footer"><div class="small-21 columns"><ul class="footer-links no-bullet text-center">{{#each this.topMenu}}<li class="left"><a href="{{topUrl}}" class="txt-grey-six" data-link>{{copy}}</a></li>{{/each}}<li class="left txt-grey">All content &#169; Tahoe Partners.</li></ul></div></div><div class="row trunk-junk" data-junk>{{#each this.bottomMenu}}<div class="large-4 medium-5 small-5 columns"><a href="{{bottomUrl}}" class="{{addClass}}" data-link></a></div>{{/each}}</div></div>';
            return content;
        },

        setTemplate: function () {
            var template = Handlebars.compile(GF.footerContent()),
                html = template(GF.footerModel());
            $('[data-footer]').append(html);
            $('[data-junk] div:eq(3)').addClass('large-pull-5');
            $('body').trigger('loaded');
        },

        init: function () {
            GF.getData();
            GF.setTemplate();
        }
    };
})();
$(document).ready(function () { GF.init(); });