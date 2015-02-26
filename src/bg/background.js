//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    var klass  = request.module;
    var action = request.action;
    var data   = request.data;
    console.log("got request: ", klass, action, data);
    sendResponse({data: 'done'});
  });


