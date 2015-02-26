// popup.js

$(document).ready(function(){
  $('#next-link').on('click', function(){
    console.log("next link clicked");
  });

  $('#config-link').on('click', function(){
    chrome.tabs.create({url: "chrome://extensions/?options="+ chrome.runtime.id });
  });


});
