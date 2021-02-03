import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

printLine("Using the 'printLine' function from the Print Module");
let paragraphs = document.getElementsByTagName('p');
console.log(paragraphs)
for (const paragraph of paragraphs) {
    console.log(paragraph)
    paragraph.style['background-color'] = getRandomColor();
}