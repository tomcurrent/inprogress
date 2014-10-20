
$('html').on('propertiesLoaded', function () {
    onSucceeded(); 
});

function onSucceeded() {
    //if current url is company, ovveride theme w/ company theme
    if (/company/.test(self.location.href.toLowerCase())) {
        //get bu site name from url, apply style
        if (window.location.pathname.split('/').length > 2) {
            var businessUnit = window.location.pathname.split('/')[2]; // changed split from 2 to 1  Tom
            applyTheme(businessUnit.toUpperCase(), false);
        }
    }
    else {
        if (userLoaded == true) {
            if ((/.com$/.test(self.location.href.toLowerCase())) ||
                    (/.com\/$/.test(self.location.href.toLowerCase())) ||
                    (/hometest.aspx$/.test(self.location.href.toLowerCase()))) {
                applyTheme(personProperties.BusinessUnit.toUpperCase(), true);
            }
            else {
                applyTheme(personProperties.BusinessUnit.toUpperCase(), false);
            }
        }
    }

    //if on collab
    if ((/pages\/collaboration-/.test(self.location.href.toLowerCase())) ||
        (/pages\/projects/.test(self.location.href.toLowerCase())) ||
        (/pages\/communities/.test(self.location.href.toLowerCase()))) {
        if (/collaboration-rh.aspx/.test(self.location.href.toLowerCase())) {
            $("div[id^=RH]").removeClass();
            $("div[id^=RH]").addClass("collabox activated  bg-RH");

            $("a[id^=RH]").removeClass();
            $("a[id^=RH]").addClass("foot-head-RH txt-white active");
        }else if (/collaboration-mb.aspx/.test(self.location.href.toLowerCase())) {
            $("div[id^=MB]").removeClass();
            $("div[id^=MB]").addClass("collabox activated  bg-MB");

            $("a[id^=MB]").removeClass();
            $("a[id^=MB]").addClass("foot-head-MB txt-white active");
        }else if (/collaboration-rfs.aspx/.test(self.location.href.toLowerCase())) {
            $("div[id^=RFS]").removeClass();
            $("div[id^=RFS]").addClass("collabox activated  bg-RFS");

            $("a[id^=RFS]").removeClass();
            $("a[id^=RFS]").addClass("foot-head-RFS txt-white active");
        }else if (/collaboration-rbg.aspx/.test(self.location.href.toLowerCase())) {
            $("div[id^=RBG]").removeClass();
            $("div[id^=RBG]").addClass("collabox activated bg-RBG");

            $("a[id^=RBG]").removeClass();
            $("a[id^=RBG]").addClass("foot-head-RBG txt-white active");
        }
    }
}

function applyTheme(bu, isHome) {
        //Apply user specific theme
        $("#mashead-bar").removeClass();
        $("#mashead-bar").addClass("masthead-colorbar ms-dialogHidden border-" + bu);

        $("#bu-indicator").removeClass();
        $("#bu-indicator").addClass("border-" + bu + " txt-grey");

        $("#DeltaSiteLogo a:first-child").removeClass();
        $("#DeltaSiteLogo a:first-child").addClass("ms-siteicon-a foot-" + bu + " txt-grey");
        

        //Replace Annoucements header logo (either Company or User specific)
        if (isHome == false) {
            $("#ctrl-announcmts-logo").removeClass();
            $("#ctrl-announcmts-logo").addClass("foot-head-" + bu + " txt-white");
        } else {
            $("#ctrl-announcmts-logo").removeClass();
            $("#ctrl-announcmts-logo").addClass("foot-head-RH txt-white");
        }


        //company left nav - main header
        $(".nav-left-main > ul:first > li:first > a:first").removeClass();
        $(".nav-left-main > ul:first > li:first > a:first").addClass("static menu-item ms-core-listMenu-item ms-displayInline ms-navedit-linkNode txt-white bg-" + bu)


        //add BU to view all pages
        //var viewAllUrl = "Pages/view-all-announcements.aspx#Default=%7B%22k%22%3A%22%22%2C%22r%22%3A%5B%7B%22n%22%3A%22RHCBusinessUnit%22%2C%22t%22%3A%5B%22%5C%22" + bu + "%5C%22%22%5D%2C%22o%22%3A%22and%22%2C%22k%22%3Afalse%2C%22m%22%3Anull%7D%5D%7D";
        //var viewAllEventsUrl = "Pages/view-all-events.aspx#Default=%7B%22k%22%3A%22%22%2C%22r%22%3A%5B%7B%22n%22%3A%22RHCBusinessUnit%22%2C%22t%22%3A%5B%22%5C%22" + bu + "%5C%22%22%5D%2C%22o%22%3A%22and%22%2C%22k%22%3Afalse%2C%22m%22%3Anull%7D%5D%7D";

        //$("#ctrl-announcmts-viewall").attr("href", viewAllUrl)
        //$("#ctrl-events-viewall").attr("href", viewAllEventsUrl)
}

