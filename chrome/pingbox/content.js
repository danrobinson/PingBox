
var j = document.createElement('script');
j.src = chrome.extension.getURL('jquery-1.10.2.min.js');
(document.head || document.documentElement).appendChild(j);

var g = document.createElement('script');
g.src = chrome.extension.getURL('gmail.js');
(document.head || document.documentElement).appendChild(g);

var r = document.createElement('script');
r.src = chrome.extension.getURL('react-with-addons.min.js');
(document.head || document.documentElement).appendChild(r);

var jsx = document.createElement('script').setAttribute('type', 'text/jsx');
jsx.src = chrome.extension.getURL('JSXTransformer.js');
(document.head || document.documentElement).appendChild(jsx);

var m = document.createElement('script');
m.src = chrome.extension.getURL('main.js');
(document.head || document.documentElement).appendChild(m);

console.log("Added ", jsx);