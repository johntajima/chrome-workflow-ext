// popup.js

$(document).ready(function(){

  function createWorkTab(url) {
    chrome.tabs.create({url: url, active: true}, function(tab){
      localStorage.setItem('workflow:tab', tab.id);
    });
  };

  function openWorkTab(url) {
    var workTab = parseInt(localStorage.getItem("workflow:tab"), 10);
    if (workTab) {
      chrome.tabs.get(workTab, function(tab){
        // open existing or new tab
        tab === undefined ? createWorkTab(url) : chrome.tabs.update(workTab, {url: url, active: true});
        localStorage.setItem("workflow:current_url", url);
      });
    } else {
      createWorkTab(url);
    }
    workTab = parseInt(localStorage.getItem("workflow:tab"), 10);
    chrome.tabs.executeScript(null, {file: 'form.js'});

  };


  var count = Workflow.urls.count();
  $('#workitems-count').text(count);

  $('#next-workitem').on('click', function(){
    var url = Workflow.urls.next();
    if (url) {
      // open work tab
      openWorkTab(url);
    } else {
      // warn that it's empty
      chrome.tabs.create({url: "chrome://extensions/?options="+ chrome.runtime.id });
    }
  });

  $('#config-workflow').on('click', function(){
    chrome.tabs.create({url: "chrome://extensions/?options="+ chrome.runtime.id });
  });


});
