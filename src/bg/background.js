$(document).ready(function(){

  //example of using a message handler from the inject scripts
  chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
      var tab = sender.tab;
      if (tab.id !== parseInt(localStorage.getItem('workflow:tab'), 10)) {
        console.log("Not workitem tab - ignore");
        return;
      } else {
        console.log("got request: ", request, sender.url);
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
  data.url = this.current_url();
  var records = JSON.parse(localStorage.getItem("workflow:data")) || [];
  records.push(data);
  var entry = JSON.stringify(records);

  localStorage.setItem("workflow:data", entry);
};

Workitem.buildForm = function() {
  var form = Workflow.form.preview();
//   var text  = "\
// <div id='workitem-frame'>\
//   <h4>Workflow Form</h4>";
//   text += form[0].outerHTML;
//   text += "\
//   <button id='workitem-save-btn' class='btn btn-primary'>Save Data</button>\
//   <button id='workitem-next-btn' class='btn btn-success pull-right'>Next >></button>\
//   <iframe seamless srcdoc=\"" + form[0].outerHTML.replace(/"/g,'&quot;') + '"></iframe>' +
//   "<div id='workform-msg'></div>\
// </div>";
//   console.log("form data is");
//   console.log(text);

  var text = "<iframe seamless id='workitem-frame' style='width:220px;height:500px;' srcdoc=\"" + form[0].outerHTML.replace(/"/g,'&quot;');
  text  += "\
  <button id='workitem-save-btn' class='btn btn-primary'>Save Data</button>\
  <button id='workitem-next-btn' class='btn btn-success pull-right'>Next >></button>";
  text +=  "\"></iframe>";
  return text;
};



