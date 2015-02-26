// options.js


var Workflow = Workflow || {};

// DB that stores the URLs
Workflow.urls = {
  db: localStorage,

  // pops next item or returns nil if empty
  next: function(){
    var list = JSON.parse(this.db.getItem('workflow:urls'));
    var url = list.shift();
    this.set(list);
    return url;
  },

  // updates db with text
  set: function(array){
    if (!(array instanceof Array)) {
      array = array.split(/\n|,/);
      array = _.map(array, function(el){
        return el.trim();
      });
      array = _.reject(array, function(el){
        return el.length === 0;
      });
    }

    console.log("Updating db with ", array);
    this.db.setItem('workflow:urls', JSON.stringify(array));
    return array.join("\n");
  },

  list: function(){
    if (this.db['workflow:urls']) {
      return JSON.parse(this.db.getItem('workflow:urls'));
    } else {
      return null;
    }
  },
  // empty db
  clear: function(){
    this.db.setItem('workflow:urls', null);
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
