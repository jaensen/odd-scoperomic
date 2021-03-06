
Template.postSubmit.events({

    // Updating the profile URL. Check new URL, and save in session if successful
    'click #validate-my-profile': function(e) {
        e.preventDefault();
        var url = ($("input[name=myProfileUrl]").val());
        var oldUrl = SessionAmplify.get('myProfileUrl');
        throwError('Setting profile URL: ' + url);
        Meteor.call("updateUserProfileUrl", url, function(error, result) {
            if (result == "OK") {
                SessionAmplify.set('myProfileUrl', url);
                throwError('Success. Updated your profile URL to: ' + url);
            } else {
                $("input[name=myProfileUrl]").val(oldUrl);
                throwError('Updating profile URL failed, reverting: ' + result);
            }
        });
    },

    'click #create-context': function(e) {
        e.preventDefault();
        var context = ($("#createContext").val());
        contexts.push(context);
        profileAdd('contexts', {})
        Meteor.call("updateUserProfileUrl", url, function(error, result) {
            if (result == "OK") {
                SessionAmplify.set('myProfileUrl', url);
                throwError('Success. Updated your profile URL to: ' + url);
            } else {
                $("input[name=myProfileUrl]").val(oldUrl);
                throwError('Updating profile URL failed, reverting: ' + result);
            }
        });
    },

    // Adding a new context. Attempt to add and report status. Always clear input box after.
    'keydown #subscribeToContextUrl': function(e) {
        if (e.which == 13) {
            e.preventDefault();
            var contextUrl = $("#subscribeToContextUrl").val();
            throwError('Adding context: ' + contextUrl);
            Meteor.call("subscribeToContext", contextUrl, function(error, result) {
                if (result == "OK") {
                    throwError('Success. Subscribed to: ' + url);
                } else {
                    throwError('Failed to subscribe to: ' + url + " because " + result);
                }
            });
            $("#subscribeToContextUrl").val('');
        }
    }
})

Template.postSubmit.helpers({
    myProfileUrl: function() {
        return SessionAmplify.get('myProfileUrl');
    },
    subscribeProfileUrl: function() {
        return ;
    }
});