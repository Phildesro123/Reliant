
function messageContent(type) {
    return new Promise(function(resolve) {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {type: type}, resolve)
        })
    })
  }


  export default messageContent;