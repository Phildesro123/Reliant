import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');
document.querySelector('div').addEventListener('selectionchange', () => {
  console.log('Selection updated');
});
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

chrome.runtime.onMessage.addListener((req, send, sendResponse) => {
  console.log(
    send.tab ? 'from a content script:' + send.tab.url : 'from the extension'
  );
  let paragraphs = document.getElementsByTagName('p');
  console.log(paragraphs);
  for (const paragraph of paragraphs) {
    //console.log(paragraph.textContent)
    paragraph.style['background-color'] = getRandomColor();
  }
  sendResponse({ message: 'ACK' });
});
printLine("Using the 'printLine' function from the Print Module");
/*let paragraphs = document.getElementsByTagName('p');
//console.log(paragraphs)
for (const paragraph of paragraphs) {
    //console.log(paragraph.textContent)
    paragraph.style['background-color'] = getRandomColor();
}
*/
