$(document).ready(function(){

  //example of using a message handler from the inject scripts
  chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
      var tab = sender.tab;
      if (tab.id !== parseInt(localStorage.getItem('workflow:tab'), 10)) {
        console.log("Not workitem tab - ignore");
        return;
      } else {
        console.log("got request: ", request, sender);
        var data = "ok";
        switch(request.action) {
          case "workitem:done":
            Workitem.done();
            break;
          case "workitem:next":
            Workitem.next(tab.id);
            break;
          case "workitem:get_form":
            data = Workitem.buildForm();
            break;
          case "workitem:save":
            data = 'error';
            Workitem.saveData(request.data);
            break;
        }

        sendResponse({data: data});
      }
    }
  );

});


var Workitem = Workitem || {};

Workitem.current_url = function() {
  return localStorage.getItem('workflow:current_url');
};

Workitem.next = function(tab_id) {
  var url = Workflow.urls.next();
  console.log("[bg] Opening next url ", url);
  Workflow.tabs.open(url);
};
Workitem.done = function() {
  var url = this.current_url();
  if (Workflow.urls.next() === url) {
    Workflow.urls.pop();
  }
};



//
// save array of [{key: <>, value: <>}] of data
// into format of
// [{key: 'url', value: 'http://'}, {key: 'asdf', value: 'asdf'}, ...]
Workitem.saveData = function(data) {
  var record = [{key: 'url', value: this.current_url()}];
  console.log("ercord is ", record);
  record = record.concat(data);
  console.log("Saving data ", record);

  var records = JSON.parse(localStorage.getItem("workflow:data")) || [];
  records.push(record);

  var entry = JSON.stringify(records);

  localStorage.setItem("workflow:data", entry);
};

Workitem.buildForm = function() {
  var text  = "\
<div id='workitem-frame'>\
  <h4>Workflow Form</h4>\
  <form class='form form-vertical' id='workitem-form'>\
    <div class='form-group'>\
      <label>Tag</label>\
      <input type='text' name='tag' class='form-control'>\
    </div>\
  </form>\
  <button id='workitem-save-btn' class='btn btn-primary'>Save Data</button>\
  <button id='workitem-next-btn' class='btn btn-success pull-right'>Next >></button>\
  <div id='workform-msg'></div>\
</div>\
  ";

  return text;
};



