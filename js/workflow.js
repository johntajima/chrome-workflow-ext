var Workflow = Workflow || {};

//
// URLs DB
//
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


//
// handles opening and managing tabs
//
Workflow.tabs = {
  // find or create new tab
  open: function(url) {
    if (!url) { return Workflow.tabs.openOptionsTab(); }

    var workTab = parseInt(localStorage.getItem("workflow:tab"), 10);
    if (workTab) {
      chrome.tabs.get(workTab, function(tab){
        // open existing or new tab
        tab === undefined ? Workflow.tabs._create(url) : chrome.tabs.update(workTab, {url: url, active: true});
        localStorage.setItem("workflow:current_url", url);
      });
    } else {
      Workflow.tabs._create(url);
    }
    workTab = parseInt(localStorage.getItem("workflow:tab"), 10);
    chrome.tabs.executeScript(null, {file: '/src/inject/workitem.js'});
  },

  // create a new tab
  _create: function(url) {
    chrome.tabs.create({url: url, active: true}, function(tab){
      localStorage.setItem('workflow:tab', tab.id);
    });
  },

  openOptionsTab: function() {
    chrome.tabs.create({url: "chrome://extensions/?options="+ chrome.runtime.id });
  }
};
