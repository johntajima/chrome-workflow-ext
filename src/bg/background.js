$(document).ready(function(){

  //example of using a message handler from the inject scripts
  chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
      var tab = sender.tab;
      if (tab.id !== parseInt(localStorage.getItem('workflow:tab'), 10)) {
        console.log("Not workitem tab - ignore");
        return;
      } else {
        console.log("got request: ", request, sender);
        if (request.action === "workitem:done") { Workitem.done(); }
        if (request.action === "workitem:next") { Workitem.next(tab.id); }
        sendResponse({data: 'ok'});
      }
    }
  );

});


var Workitem = Workitem || {};
Workitem.next = function(tab_id) {
  var url = Workflow.urls.next();
  console.log("[bg] Opening next url ", url);
  Workflow.tabs.open(url);
};
Workitem.done = function() {
  var url = localStorage.getItem('workflow:current_url');
  if (Workflow.urls.next() === url) {
    Workflow.urls.pop();
  }
};


