/// <reference path="../App.js" />

(function () {
    "use strict";

    // The Office initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();

            displayItemDetails();
        });
    };

    // Displays the "Subject" and "From" fields, based on the current mail item
    function displayItemDetails() {
        Parse.initialize("8fhsO5d7WTt6c7ffpVrPpHTVvuAi6vArrciyt8cK", 
                         "1GHMsEbKTKr7ZhLqcJUPcOJdi7CLD1YZeT4hGuEv");

        if (Parse.User.current() === null) {
          $("#content-main").hide();
          $("#content-login").show();
        } else {
          $("#content-main").show();
          $("#content-login").hide();
        }

        var item = Office.cast.item.toItemRead(Office.context.mailbox.item);

        // Set task's title to the email's subject
        $('#tasktitle').val(item.subject);

        // Set task assigner to be the user
        $('#taskassignedto').val(Office.context.mailbox.userProfile.emailAddress);

        // Add the email sender to the watchlist
        var watchlist = [];
        var from;
        if (item.itemType === Office.MailboxEnums.ItemType.Message) {
            from = Office.cast.item.toMessageRead(item).from;
        } else if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
            from = Office.cast.item.toAppointmentRead(item).organizer;
        }
        if (from) {
           // $('#taskwatch0').val(from.emailAddress);
           watchlist = watchlist.concat(from.emailAddress);
        }

        // Add CC recipients to watch list
        if (item.itemType === Office.MailboxEnums.ItemType.Message) {
            var cc = Office.context.mailbox.item.cc;
            for (var i=0; i < cc.length; i++) {
                watchlist = watchlist.concat(cc[i].emailAddress);
                $('#taskassignedto').val(watchlist.concat(cc[0].emailAddress));
                // $('#taskwatchers').concat('<input type="email" class="form-control" value="'+cc[i].emailAddress+'">');
            }
        } else if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
            // TODO(cjr) add support for appointments
        }

        // Add TO recipients to watch list
        if (item.itemType === Office.MailboxEnums.ItemType.Message) {
            var to = Office.context.mailbox.item.to;
            for (var i=0; i < to.length; i++) {
                // $('#taskwatchers').concat('<input type="email" class="form-control" value="'+to[i].emailAddress+'">');
                watchlist = watchlist.concat(to[i].emailAddress);
            }
        } else if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
            // TODO(cjr) add support for appointments
        }
        
        var watchEmails = watchlist.join(', ');
        $('#taskwatch').val(watchEmails);
        
        $("#submit-button").click(function() {
          // TODO: Logic for adding task
          var title = $('#tasktitle').val();
          var assignee = $('#taskassignedto').val();
          var description = $('#taskdesc').val();
          var watchers = $('#taskwatch').val().replace(/ /g, '').split(",");      
          var email = null;  // TODO: set up link to email
          
          write(title + " " + assignee);
          
          Parse.Cloud.run("assignTask", {
            title: title,
            description: description,
            assignee: assignee,
            watchers: watchers,
            email: email,
          }, {
            success: function(result) {
              $("#assign-success").html("Task created!");
            },
            error: function(error) {
              $("#assign-alert").html("error " + error.message);
            }
          })
        });
        $("#login").submit(function(event) {
          event.preventDefault();
        
          var username = $("#username").val();
          var password = $("#password").val();

          Parse.User.logIn(username, password, {
            success: function(user) {
              displayItemDetails();
            },
            error: function(user, error) {
              $("#login-alert").html("Error: " + error.message);
            }
          });
        });
        $("#logout-button").click(function() {
          Parse.User.logOut();
          displayItemDetails();
        });
                
        write("console 8");
    }
})();
