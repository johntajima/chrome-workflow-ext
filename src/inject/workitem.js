// form.js
// script that runs on work url

var WorkItem = WorkItem || {};
chrome.runtime.sendMessage({action: "workitem:start"}, function(response) {
  if (response.data === 'ok') {
    WorkItem.init(); // temporary
  }
});


WorkItem.init = function() {
  chrome.runtime.sendMessage({action: "workitem:get_form"}, function(response) {
    // insert form
    var body = document.getElementsByTagName('body')[0];
    var div = document.createElement('div');
    div.innerHTML = response.data;
    var child = body.childNodes[0];
    body.insertBefore(div, child);

    console.log("[workflow] init listeners");
    setTimeout(initListeners, 1000);

    function initListeners(){
      var iframe_doc = document.getElementById('workitem-frame').contentWindow.document;
      var savebtn = iframe_doc.getElementById('workitem-next-btn');
      if (!savebtn){
        console.log("[workflow] trying again for listeners");
        setTimeout(initListeners, 1000);
        return;
      }
      savebtn.addEventListener('click', function(){
        WorkItem.next();
      });

      var nextbtn = iframe_doc.getElementById('workitem-save-btn');
      nextbtn.addEventListener('click', function(){
        WorkItem.saveData(iframe_doc);
      });
      console.log("[workflow] done init");
    }

  });
};

WorkItem.next = function() {
  chrome.runtime.sendMessage({action: "workitem:done"}, function(response) {
    console.log(response.data);
  });
  chrome.runtime.sendMessage({action: "workitem:next"}, function(response) {
    console.log(response.data);
  });
};

WorkItem.saveData = function(doc){
  var form = doc.getElementById("workitem-form");
  var data = WorkItem.serialize(form);
  console.log(data);
  chrome.runtime.sendMessage({action: "workitem:save", data: data}, function(response) {
    console.log(response.data);
    if (response.data === 'ok') {
      WorkItem.next();
    } else {
      var el = doc.getElementById('workform-msg');
      el.innerHTML = response.data;
    }
  });
};


WorkItem.serialize = function(form) {
  if (!form || form.nodeName !== "FORM") {
    return;
  }
  var i, j, q = [];
  for (i = form.elements.length - 1; i >= 0; i = i - 1) {
    if (form.elements[i].name === "") {
      continue;
    }
    switch (form.elements[i].nodeName) {
    case 'INPUT':
      switch (form.elements[i].type) {
      case 'text':
      case 'hidden':
      case 'password':
      case 'button':
      case 'reset':
      case 'submit':
        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
        break;
      case 'checkbox':
      case 'radio':
        if (form.elements[i].checked) {
          q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
        }
        break;
      case 'file':
        break;
      }
      break;
    case 'TEXTAREA':
      q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
      break;
    case 'SELECT':
      switch (form.elements[i].type) {
      case 'select-one':
        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
        break;
      case 'select-multiple':
        for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
          if (form.elements[i].options[j].selected) {
            q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
          }
        }
        break;
      }
      break;
    case 'BUTTON':
      switch (form.elements[i].type) {
      case 'reset':
      case 'submit':
      case 'button':
        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
        break;
      }
      break;
    }
  }
  // now replit k=v
  result = {};
  q.forEach(function(e){
    var items = e.split("=");
    result[items[0]] = items[1];
  });
  return result;
};

