import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import '../../assets/img/icon.png'

console.log('This is the background page.');
console.log('Put the background scripts here.');

let clickHandler = () => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'injectReact'});
    });
}
chrome.contextMenus.create({ 
    id: 'TestContext',
    title: 'Inject React Element',
    contexts: ['all']
  });

// var email;
// var id;

// var info = chrome.identity.getProfileUserInfo(function(info) {
//     email = info.email;
//     id = info.id;
//     console.log(info)
//     console.log(email)
// });
// console.log(info)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Request", request);
    console.log("Sender", sender);
    if(chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        throw Error("Unable to send to " + request)
    }
    chrome.identity.getProfileUserInfo(function(info) {
        console.log(info);
        sendResponse({email: info.email, id: info.id});
    });
    return true; //This line is what allows us to wait for the async sendResponse
});

chrome.contextMenus.onClicked.addListener(clickHandler);

