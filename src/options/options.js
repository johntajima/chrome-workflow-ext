// options.js


// -----------------------------------------
// mainline
// -----------------------------------------

$(document).ready(function(){
  function updateStats() {
    $('#export-count').text(Workflow.data.count());
    $('#urls-count').text(Workflow.urls.count());
  };

  updateStats();

  // prevent default action
  $('#urls-form').on('submit', function(e){
    e.preventDefault();
    return false;
  });

  // on click, update db
  $("#urls-submit-btn").on('click', function(e){
    e.preventDefault();
    var $field = $('#urls-list');
    Workflow.urls.set($field.val());
    $('#urls-list-msg').text("list updated");
    updateStats();
  });

  // init workflow list
  $('#urls-list').val(Workflow.urls.list().join("\n"));
  // init form

  $('#reset-data').on('click', function(e){
    e.preventDefault();
    if (confirm("Are you sure, this will delete all saved data?")) {
      Workflow.data.clear();
      updateStats();
    }
  });

  $('#export-data').on('click', function(e){
    e.preventDefault();
    var data = Workflow.data.export();
    if (data === undefined) {
      return alert("Nothing to download");
    }
    var csvContent = "data:text/csv;charset=utf-8,"+ data;
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "workflow_report.csv");

    link.click(); // This will download the data file named "my_data.csv".

  });


});
