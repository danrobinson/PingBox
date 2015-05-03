var gmail;
var topBox;

function refresh(f) {
  if( (/in/.test(document.readyState)) || (undefined === Gmail) ) {
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}

var addPingTopBox = function() {
  /*
  if (gmail.check.is_tabbed_inbox()) {
  	console.log("You are using tabs.");
  	var allInboxes = gmail.dom.inboxes();
  	if (allInboxes.length != 1) {
  		console.log("Too many inboxes!");
  	}
  	var inbox = $(allInboxes[0]);
  	inbox.before(pingTopBox);
  }*/
  PingTopBox = <PTB props={}>
  topBox = $("#top-box");
  React.render(PingTopBox, topBox)
}

var main = function() {
  // gmail = new Gmail();
  // console.log('Hello,', gmail.get.user_email());
  addPingTopBox();
}

refresh(main);
