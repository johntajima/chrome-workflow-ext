//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    var klass  = request.module;
    var action = request.action;
    var data   = request.data;
    console.log("got request: ", klass, action, data);
    var reply = Workflow[klass][action](data);
    console.log("sending reply", reply);
    sendResponse({data: reply});
  });



// ------------------------------------------------------------
// workflow obj
// ------------------------------------------------------------

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


// DB that stores the template/form json
Workflow.templates = {
  get: function(key){},
  set: function(key, value){}
};
