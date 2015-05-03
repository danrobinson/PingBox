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
        var item = Office.cast.item.toItemRead(Office.context.mailbox.item);

        // Set task's title to the email's subject
        $('#tasktitle').val(item.subject);

        // Set task assigner to be the user
        $('#taskassigner').val(Office.context.mailbox.userProfile.emailAddress);

        // Add the email sender to the watchlist
        var from;
        if (item.itemType === Office.MailboxEnums.ItemType.Message) {
            from = Office.cast.item.toMessageRead(item).from;
        } else if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
            from = Office.cast.item.toAppointmentRead(item).organizer;
        }
        if (from) {
           $('#taskwatch0').val(from.emailAddress);
        }

        // Add CC recipients to watch list
        if (item.itemType === Office.MailboxEnums.ItemType.Message) {
            var cc = Office.context.mailbox.item.cc;
            $('#tmp').val(cc.length);
            for (var i=0; i < cc.length; i++) {
                $('#taskwatchers').append('<input type="email" class="form-control" value="'+cc[i].emailAddress+'">');
            }
        } else if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
            // TODO(cjr) add support for appointments
        }

        // Add TO recipients to watch list
        if (item.itemType === Office.MailboxEnums.ItemType.Message) {
            var to = Office.context.mailbox.item.to;
            $('#tmp').val(to.length);
            for (var i=0; i < to.length; i++) {
                $('#taskwatchers').append('<input type="email" class="form-control" value="'+to[i].emailAddress+'">');
            }
        } else if (item.itemType === Office.MailboxEnums.ItemType.Appointment) {
            // TODO(cjr) add support for appointments
        }

        $('#tmp').val(item.internetMessageId + '\n' + Office.context.mailbox.item.body);

        // var desc = item.body;
        // if (desc.length > 300) {
        //     desc = desc.substr(0, 297) + "...";
        // }
        // $('#taskdesc').val(desc);
    }
})();
