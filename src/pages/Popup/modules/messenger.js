const messageContent = () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs)=>{
        chrome.tabs.sendMessage(tabs[0].id, {message: "Component is sending message to content script"})
    })
  }


  export default messageContent;