
var j = document.createElement('script');
j.src = chrome.extension.getURL('jquery-1.10.2.min.js');
(document.head || document.documentElement).appendChild(j);

var g = document.createElement('script');
g.src = chrome.extension.getURL('gmail.js');
(document.head || document.documentElement).appendChild(g);

var m = document.createElement('script');
m.src = chrome.extension.getURL('main.bundle.js');
(document.head || document.documentElement).appendChild(m);
