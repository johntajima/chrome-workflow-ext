// options.js


// -----------------------------------------
// mainline
// -----------------------------------------

$(document).ready(function(){
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
  });

  // init workflow list
  $('#urls-list').val(Workflow.urls.list());
  // init form
});
