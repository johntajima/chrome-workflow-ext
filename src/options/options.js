// options.js

var Workflow = Workflow || {};
Workflow.urls = {
  next: function(){
    this._sendRequest('next', null, function(response){
      console.log("got response: ", response);
    });
  },
  set: function(values){
    this._sendRequest('set', values, function(response){
      $('#urls-list').val(response.data);
      $('#urls-list-msg').text("URLs list updated");
      console.log(response);
    });
  },
  list: function(){},
  clear: function(){},
  _sendRequest: function(action, data, callback) {
    chrome.runtime.sendMessage({module: 'urls', action: action, data: data}, function(response){
      console.log('got response', response);
      callback(response);
    });
  }
};


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
  });

  // init workflow list
  $('#urls-list').val(Workflow.urls.list());


});
