import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import '../../assets/img/icon.png'
import axios from 'axios';

console.log('This is the background page.');
console.log('Put the background scripts here.');

chrome.webRequest.onBeforeRequest.addListener(
    function(details) { 
      return {cancel: true}; 
    },
    {urls: 
      ["*://*.doubleclick.net/*",
      "*://*.googleadservices.com/*",
      "*://*.googlesyndication.com/*",
      "*://*.moat.com/*",
      "https://subscribe.wired.com/*"]
    },
    ["blocking"]
  );

chrome.runtime.onInstalled.addListener(function(details) {
    if(details.reason == "install") {
        console.log("This is the first install!")
        console.log("Adding user to database")
        chrome.identity.getProfileUserInfo((userInfo) => {
              axios.post('http://localhost:4000/api/user',{
                _id: userInfo.id,
                email: userInfo.email,
                displayName: userInfo.email
              }).then(() => {
                console.log("Data has been sent to the server")
              })
              .catch(() => {
                console.log("Internal server error")
              });
        });
    }
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        throw Error("Unable to send to " + request)
    }
    if (request == "userInfo") {
        chrome.identity.getProfileUserInfo(function(info) {
            sendResponse({email: info.email, id: info.id});
        });
    }
    else if (request == "activeURL") {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            sendResponse(tabs[0].url);
        });
        
    }
    return true; //This line is what allows us to wait for the async sendResponse
});
