
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
});

Parse.Cloud.define("ping", function(request, response) {
  if (request.user === null) {
    response.error("User not logged in.");
  }

  if (request.params.taskId === null) {
    response.error("No task ID");
  }

  // Make sure pinger has not used > 3 pings or pinged this task today
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var pings = new Parse.Query("Ping");
  pings.greaterThan("createdAt", today);
  pings.equalTo("creator", request.user);
  
  pings.find({
    success: function(results) {
      if (results.length > 2) {
        response.error("User has already sent three Pings today.");
      } else {
        var match = false;
        results.forEach(function(ping) {
          if (ping.get("task").id == request.params.taskId) {
            match = true;
          }
        });
        if (match) {
          response.error("User has already pinged that task today.");
        } else {
          var tasks = new Parse.Query("Task");
          tasks.get(request.params.taskId, {
              success: function(task) {
                task.increment("score");
                task.save(null, {
                  error: function(object, error) {
                    response.error("Saving led to error code: " + error.message);
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
          );

        }
      }
  }});  
});

Parse.Cloud.define("todayPings", function(request, response) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var pings = new Parse.Query("Ping");
  pings.greaterThan("createdAt", today);
  pings.equalTo("creator", request.user);

  pings.find().then(function(results) {
    response.success(results);
  })
});
