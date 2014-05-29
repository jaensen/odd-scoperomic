
var feedPollingHandle;
var pollingInterval = 2500; // ms. How often to poll for changes on a remote API
var feedCheckTimeout = 10000; // ms. How long to wait for a response when validating a profile URL

function startPolling(url, interval) {
    feedPollingHandle = Meteor.setInterval(
        function() {
            jsonData = Meteor.http.call("GET", url, {headers: {Accept: 'application/vnd.odd-profile.v1+json'}});
            console.log('polled');
            // console.log(jsonData.content);
            var json = JSON.parse(jsonData.content);

            for (var i in json.posts) {
                console.log('json: ' + json.posts[i]);

                var post = JSON.parse(json.posts[i]);
                    console.log(post);

                    console.log(post.title);
                    console.log(post.url);
                    if (Posts.find({title: post.title, url: post.url}).count() == 0) {
                        Posts.insert({title: post.title, url: post.url});
                    }
            }
        },
        interval);
}

// Check that profile URL is valid
// For now just make sure that it returns 200.
function validateProfileUrl(url) {
    var Future = Npm.require("fibers/future");
    var fut = new Future();
    try {
        Meteor.http.call("GET", url, {timeout: feedCheckTimeout, headers: {Accept: 'application/vnd.odd-profile.v1+json'}}, function(error, result) {
            if (result && result.statusCode == 200) {
                fut.return(true);
            } else {
                console.log("Call to " + url + " failed");
                console.log(result);
                console.log(error);
                fut.return(false);
            }
        });
    } catch (e) {
        console.log("Exception from http call");
        fut.return(false);
    }
    return fut.wait();
}

// Active profile interface abstracted here
function getProfileAddUrl(url) {
    return url + "/add.php";
}

Meteor.methods({

    // Logic that happens when user enters/changes their personal profile URL

    // This is where authentication step should be added
    updateUserProfileUrl: function (url) {
        console.log("your user id is " + Meteor.userId());
        if (!validateProfileUrl(url)) {
            return "INVALID";
        } else {
            if (feedPollingHandle) {
                Meteor.clearInterval(feedPollingHandle);
            }
            Posts.remove({});
            feedPollingHandle = startPolling(url, pollingInterval);
            return "OK";
        }
    },

    // When new status submitted
    postToProfile: function (profileUrl, message) {
        var result = Meteor.http.call("POST", getProfileAddUrl(profileUrl), {params: {profileitem: message}});
        if (result.statusCode == 200) {
            return "OK";
        } else {
            return "FAIL";
        }
    }
});


