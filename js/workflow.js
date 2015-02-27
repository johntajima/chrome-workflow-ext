

var Workflow = Workflow || {};

// DB that stores the URLs
Workflow.urls = {
  // get next item or returns nil if empty - but doesn't remove it
  next: function(){
    var list = JSON.parse(localStorage.getItem('workflow:urls'));
    var url = (list.length > 0) ? list[0] : null;
    return url;
  },

  pop: function(){
    var list = JSON.parse(localStorage.getItem('workflow:urls'));
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
    localStorage.setItem('workflow:urls', JSON.stringify(array));
    return array.join("\n");
  },

  list: function(){
    if (localStorage['workflow:urls']) {
      return JSON.parse(localStorage.getItem('workflow:urls'));
    } else {
      return null;
    }
  },
  // empty db
  clear: function(){
    localStorage.setItem('workflow:urls', null);
  },

  count: function(){
    return this.list().length;
  }
};


// DB that stores the template/form json
Workflow.templates = {
  get: function(key){},
  set: function(key, value){}
};

