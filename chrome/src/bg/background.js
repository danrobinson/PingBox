// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

console.log("Yeah");

//example of using a message handler from the inject scripts
/*
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });
*/
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request.cmd == "read_file") {
        $.ajax({
            url: chrome.extension.getURL("topbar.html"),
            dataType: "html",
            success: sendResponse
        });
    }
});

chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
	  console.log('Turning ' + tab.url + ' red!');
	  chrome.tabs.executeScript({
	    code: 'document.body.style.backgroundColor="red"'
    });
});
