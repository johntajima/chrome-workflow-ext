// popup.js

$(document).ready(function(){

  // update next count
  var count = Workflow.urls.count();
  $('#workitems-count').text(count);

  // listen on next button
  $('#next-workitem').on('click', function(){
    var url = Workflow.urls.next();
    Workflow.tabs.open(url);
  });

  // listen on menu item
  $('#config-workflow').on('click', function(){
    Workflow.tabs.openOptionsTab();
  });

});
