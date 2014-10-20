$(".accordion-navigation a").click(function () {
    $(this).next('div').slideToggle("fast");
});

$(document).ready(function() {
    $().SPServices({
        operation:"GetWebCollection",
        completefunc: function (xData, status) {$(xData.responseXML).find("Web").each(function() {
            // var weburlvar = $(this).attr("Url");
            //alert(weburlvar);
        
            if(checkwebaccess($(this).attr("Url")))
            {
                console.log($(this).attr("Url"));
            }
        });
        }
    });
});

function checkwebaccess(weburl) {
    $().SPServices({
        operation: "GetRolesAndPermissionsForCurrentUser",
        webURL: weburl,
        async: false,
        completefunc: function (xData, Status) {
            //alert(xData.responseXML.xml);
            // var userPerm = $(xData.responseXML).find("[nodeName=Permissions]").attr("Value");
            //alert("userPerm = " + userPerm);

            if ($(xData.responseXML).find("[nodeName=Permissions]").attr("Value") != "undefined")
            { return true; }
            else
            { return false; }
        }
    });
}