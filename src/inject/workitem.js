// form.js
// script that runs on work url

// render form template
// listen to submit/next button

var WorkItem = WorkItem || {};
chrome.runtime.sendMessage({action: "workitem:start"}, function(response) {
  if (response.data === 'ok') {
    WorkItem.init(); // temporary
  }
});


WorkItem.init = function() {
  chrome.runtime.sendMessage({action: "workitem:get_form"}, function(response) {
    $('body').append(response.data);
  });
};

WorkItem.next = function() {
  chrome.runtime.sendMessage({action: "workitem:done"}, function(response) {
    console.log(response.data);
  });
  chrome.runtime.sendMessage({action: "workitem:next"}, function(response) {
    console.log(response.data);
  });

};

