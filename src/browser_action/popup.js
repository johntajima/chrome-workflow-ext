// popup.js

$(document).ready(function(){

  $('#workitems-count').text(Workflow.urls.count());
  $('#export-count').text(Workflow.data.count());

  // listen on next button
  $('#next-workitem').on('click', function(){
    var url = Workflow.urls.next();
    Workflow.tabs.open(url);
  });

  // listen on menu item
  $('#config-workflow').on('click', function(){
    Workflow.tabs.openOptionsTab();
  });

  // export data
  $('#export').on('click', function(){
    var data = Workflow.data.export();
    var csvContent = "data:text/csv;charset=utf-8," + data;
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "workflow_export.csv");

    link.click(); // This will download the data file named "my_data.csv".
  });

});
