
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

Parse.Cloud.define("assignTask", function(request, response) {
  if (request.user === null) {
    response.error("User not logged in.");
  }
  var Task = Parse.Object.extend("Task");
  var task = new Task();
  task.set("title", request.params.title);
  task.set("description", request.params.description);
  task.set("email", request.params.email);
  task.set("score", 0);
  task.set("creator", request.user);

  var emails = request.params.watchers;
  var watcherQuery = new Parse.Query("_User");
  watcherQuery.containedIn('email', emails);
  watcherQuery.find({
    success: function(results) {
      if (results.length == 0) {
        // TODO: Email invite functionality.
        response.error("No watchers signed up with PingBox.");
      } else {
        task.set("watchers", results);

        // Set assignee
        var assigneeEmail = request.params.assignee;
        var assigneeQuery = new Parse.Query("_User");
        assigneeQuery.equalTo('email', assigneeEmail);
        assigneeQuery.find({
          success: function(results) {
            task.set("assignee", results[0]);
            task.save({
              success: function(result) {
                response.success({
                  task: task
                });
              },
              error: function(error) {
                response.error(error);
              }
            });
          },
          error: function(error) {
            response.error("No user found matching assignee.");
          }
        });
      }
    },
    error: function() {
      response.error("User lookup failed.");
    }
  });
});

Parse.Cloud.define("ping", function(request, response) {
  if (request.user === null) {
    response.error("User not logged in.");
  }

  if (request.params.taskId === null) {
    response.error("No task ID");
  }

  // Make sure pinger has not used > 3 pings
  var pings = new Parse.Query("Ping");
  // TODO

  // Make sure pinger has not pinged task today
  var pings = new Parse.Query("Ping");
  // TODO

  var tasks = new Parse.Query("Task");
  tasks.get(request.params.taskId, {
      success: function(task) {
        task.increment("score");
        task.save(null, {
          error: function(object, error) {
            console.log("Saving led to error code: " + error.message);
          }
        });
        var Ping = Parse.Object.extend("Ping");
        var ping = new Ping();
        ping.set("task", task);
        ping.set("creator", request.user);
        ping.save({
          success: function(result) {
            response.success({
              task: task,
              ping: ping
            });
          },
          error: function(error) {
            response.error(error);
          }
        });

      },
      error: function(error) {
        response.error("Task with that objectId not found");
      }
    }
  )
});

Parse.Cloud.define("todayPings", function(request, response) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var pings = new Parse.Query("Ping");
  pings.greaterThan("createdAt", today);
  pings.equalTo("creator", request.user);
  pings.find({
    success: function(results) {
      response.success(results);
    },
    error: function(error) {
      response.error(error);
    }
  });
});

