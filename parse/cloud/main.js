
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.beforeSave("Task", function(request, response) {
  request.object.set("score", 0);
  request.object.set("creator", request.user);
  var emails = request.object.get("users");
  var userQuery = Parse.Query("User");
  userQuery.containedIn('email', emails);
  userQuery.find({
    success: function(results) {
      if (results.length == 0) {
        // TODO: Email invite functionality.
        response.error("No watchers signed up with PingBox.");
      }
      request.objects.set("users", results);
    },
    error: function() {
      response.error("User lookup failed.");
    }
  });
});
