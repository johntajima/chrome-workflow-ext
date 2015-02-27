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
    console.log(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");

    link.click(); // This will download the data file named "my_data.csv".
  });

  $('#reset-data').on('click', function(){
    Workflow.data.clear();
    // not sure why this didn't work in a function
    $('#workitems-count').text(Workflow.urls.count());
    $('#export-count').text(Workflow.data.count());
  });

});
