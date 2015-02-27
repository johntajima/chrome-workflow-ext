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
    var list = this.list();
    return list ? list.length : 0;
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

Workflow.data = {
  // convert data into csv format with header
  export: function() {
    var data = this.list();
    if (!data || data.length === 0) { return; }

    // keys of entry
    var k = _.keys(data[0]);

    // extract url from keys
    remaining = _.without(k, "url");
    console.log("remaining keys are", remaining);

    // build csv
    var csvContent = "";
    csvContent += "url," + remaining.join(",") + "\n";

    _.each(data, function(entry){
      var line = entry.url + ",";
      line += _.map(remaining, function(key){
        return entry[key];
      }).join(",");
      csvContent += line + "\n";
    });
    return csvContent;
  },

  list: function() {
    return JSON.parse(localStorage.getItem('workflow:data'));
  },

  // returns count of entries
  count: function() {
    var list = this.list();
    return list ? list.length : 0;
  },

  // clear db
  clear: function() {
    localStorage.removeItem('workflow:data');
  }
};

// workflow Form config
Workflow.form = {
  process: function(data) {
    try {
      this.save(JSON.parse(data));
    } catch(_error) {
      alert(_error);
      return false;
    }
    return true;
  },

  save: function(json) {
    localStorage.setItem('workflow:form', JSON.stringify(json));
  },

  loadConfig: function() {
    return JSON.parse(localStorage.getItem('workflow:form') || "[]");
  },

  preview: function(){
    var config = this.loadConfig();
    var form = $('<form>');
    var html = _.each(config, function(entry){
      var type = Workflow.elements.map[entry.type];
      var el = new Workflow.elements[type](entry.name, entry.label, entry.options);
      form.append(el);
    });
    return form;
  }
};


//
// form elements
//
Workflow.elements = {
  map: {
    'text': 'textfield',
    'select': 'select',
    'checkbox': 'checkbox',
    'radio': 'radiobutton'
  }
};
Workflow.elements.textfield = function(name, label, options) {
  var wrapper = $("<div class='form-group'></div>");

  var labelEl = $("<label for="+name+">");
  labelEl.text(label);
  var el = $("<input type='text' class='form-control'>");
  el.attr('name', name);
  el.attr('placeholder', "Enter value");

  var div = $("<div class='form-controls'></div>");
  div.append(labelEl).append(el);
  wrapper.append(div);
  return wrapper;
};

Workflow.elements.checkbox = function(name, label, options) {
  var wrapper = $("<div class='form-group'></div>");
  var div = $("<div class='form-controls'></div>");
  var label = $('<span class="form-label">').text(label);
  div.append(label);
  var els = _.each(options, function(val){
    var checkEl = $("<div class='checkbox-inline'></div>");
    var labelEl = $("<label>");
    var el = $("<input type='checkbox'>");
    el.attr('value', val);
    labelEl.text(val);
    labelEl.prepend(el);
    checkEl.append(labelEl);
    div.append(checkEl);
    wrapper.append(div);
  });
  return wrapper;
};

Workflow.elements.radiobutton = function(name, label, options) {
  var wrapper = $("<div class='form-group'></div>");
  var div = $("<div class='form-controls'></div>");
  var label = $('<span class="form-label">').text(label);
  div.append(label);
  var els = _.each(options, function(val){
    var checkEl = $("<div class='radio-inline'></div>");
    var labelEl = $("<label>");
    var el = $("<input type='radio'>");
    el.attr('value', val).attr('name', name);
    labelEl.text(val);
    labelEl.prepend(el);
    checkEl.append(labelEl);
    div.append(checkEl);
  });
  wrapper.append(div);
  return wrapper;
};

Workflow.elements.select = function(name, label, options) {
  var wrapper = $("<div class='form-group'></div>");
  var labelEl = $("<label for="+name+">").text(label);
  var el      = $("<select class='form-control'>").attr('name',name);
  var options = _.each(options, function(val){
    var optEl = $("<option>").attr('value', val).text(val);
    el.append(optEl);
  });

  var div = $("<div class='form-controls'></div>");
  div.append(labelEl).append(el);
  wrapper.append(div);
  return wrapper;
};
