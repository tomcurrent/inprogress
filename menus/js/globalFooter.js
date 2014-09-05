var GF = (function() {
  'use strict';
  return {
    getData : function() {
      // TODO ajax call to get data and pass it into footerModel()
    },

    footerModel : function() {
      var data = {
        topMenu: [
          {copy: "Ethics Hotline", topUrl: "#"},
          {copy: "Help Desk", topUrl: "#"},
          {copy: "Logout", topUrl: "#"},
          {copy: "Terms &amp; Conditions", topUrl: "#"}
        ],
        bottomMenu: [
          {name: "reyesHolding", addClass: "foot-logoreyhldngs", bottomUrl: "#"},
          {name: "reinheart", addClass: "foot-logorfs", bottomUrl: "#"},
          {name: "mb", addClass: "foot-logombsimple", bottomUrl: "#"},
          {name: "reyesBev", addClass: "foot-logorbg", bottomUrl: "#"}
        ]
      }
      return data;
    },

    footerContent: function() {
      var content = '<div><div class="row footer"><div class="small-21 columns"><ul class="footer-links no-bullet text-center">{{#each this.topMenu}}<li class="left"><a href="{{topUrl}}" class="txt-dark-grey">{{copy}}</a></li>{{/each}}<li class="left txt-grey-dark">All content &#169; Tahoe Partners.</li></ul></div></div><div class="row trunk-junk" data-junk>{{#each this.bottomMenu}}<div class="large-4 medium-5 small-5 columns"><a href="{{bottomUrl}}" class="{{addClass}}"></a></div>{{/each}}</div></div>';
      return content;
    },

    setTemplate : function() {
      var template = Handlebars.compile(GF.footerContent()),
          html    = template(GF.footerModel());
      $('[data-footer]').append(html);
      $('[data-junk] div:eq(3)').addClass('large-pull-5');
    },

    init : function() {
      GF.setTemplate();
    }
  };
})();
GF.init();