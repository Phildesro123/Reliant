const messageContent = (type) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {type: type})
    })
  }


  export default messageContent;