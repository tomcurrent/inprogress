$('html').on('userLoaded', function () {
    $('html').trigger('propertiesLoaded')
});
var personProperties = {},
    userLoaded;
!(function (SP, $) {   
    var checkProperties = function () {
            setTimeout(function () {
                getProperties()
            }, 200)
        },

        getProperties = function () {            
            if (!userLoaded) {
                checkProperties();
            } else {
                $('html').trigger('userLoaded');
                return false;
            }
        },

        sharePointReady = function () {
                SP.SOD.executeFunc('SP.js', 'SP.ClientContext', function () {
                    // Make sure PeopleManager is available 
                    SP.SOD.executeFunc('userprofile', 'SP.UserProfiles.PeopleManager', function () {

                        var clientContext = new SP.ClientContext.get_current();
                        var peopleManager = new SP.UserProfiles.PeopleManager(clientContext);

                        userProfileProperties = peopleManager.getMyProperties()
                        clientContext.load(userProfileProperties);
                        clientContext.executeQueryAsync(onSuccess, onFail);
                    });

                });

        },

        onSuccess = function () {
            personProperties = {
                BusinessUnit: userProfileProperties.get_userProfileProperties()['BU'],
                CountryCompany: userProfileProperties.get_userProfileProperties()['RHCompany'],
                Location: userProfileProperties.get_userProfileProperties()['RHLocation']
            }
            userLoaded = true;
        },

        onFail = function (sender, args) {
            console.log("Error: " + args.get_message());
        };
      
    $(document).ready(function () {
        $.when(getProperties())
            .always(sharePointReady());
    });
   
}(SP, jQuery));




