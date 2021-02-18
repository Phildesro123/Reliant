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

  chrome.contextMenus.onClicked.addListener(clickHandler);