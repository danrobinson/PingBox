// 
// // Use Parse.Cloud.define to define as many cloud functions as you want.
// // For example:
// Parse.Cloud.define("hello", function(request, response) {
//   response.success("Hello world!");
// });
// 
// Parse.Cloud.beforeSave("Ping", function(request, response) {
//   request.object.set("creator", request.user);
//   //TODO: Increment score on task, etc.
//   response.success();
// });
// 
// Parse.Cloud.define("assignTask", function(request, response) {
//   if (request.user === null) {
//     response.error("User not logged in.");
//   }
//   //if (!request.object.id) {
//   //  request.object.set("score", 0);
//   //}
//   var Task = Parse.Object.extend("Task");
//   var task = new Task();
//   task.set("title", request.params.title);
//   task.set("description", request.params.title);
//   task.set("email", request.params.email);
//   task.set("score", 0);
//   task.set("creator", request.user);
// 
//   var emails = request.params.watchers;
//   var watcherQuery = new Parse.Query("_User");
//   watcherQuery.containedIn('email', emails);
//   watcherQuery.find({
//     success: function(results) {
//       if (results.length == 0) {
//         // TODO: Email invite functionality.
//         response.error("No watchers signed up with PingBox.");
//       } else {
//         task.set("watchers", results);
//         task.save();
//         response.success();
//       }
//     },
//     error: function() {
//       response.error("User lookup failed.");
//     }
//   });
// });
// 
// 
// Parse.Cloud.define("ping", function(request, response) {
//   if (request.user === null) {
//     response.error("User not logged in.");
//   }
// 
//   if (request.params.taskID === null) {
//     response.error("No task ID");
//   }
// 
//   var tasks = new Parse.Query("Task");
//   tasks.get(request.params.taskID, {
//       success: function(task) {
//         task.increment("score");
//         task.save(null, {
//           error: function(object, error) {
//             console.log("Saving led to error code: " + error.message);
//           }
//         });
//         var Ping = Parse.Object.extend("Ping");
//         var ping = new Ping();
//         ping.set("task", task);
//         ping.set("creator", request.user);
//         ping.save();
// 
//         response.success();
//       },
//       error: function(error) {
//         response.error("Task with that objectId not found");
//       }
//     }
//   )
// });
// 
