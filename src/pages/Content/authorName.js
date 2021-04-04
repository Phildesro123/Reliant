import { URLS } from '../Background/workingUrls';
function convertToArr(removeText) {
  removeText = removeText.replace(' and,', ',');
  removeText = removeText.replace(' and', ',');
  //remove trailing comma and split then removes white spaces
  return removeText
    .replace(/(^,)|(,$)/g, '')
    .split(',')
    .map(Function.prototype.call, String.prototype.trim);
}
export function authorName(hostname) {
  var author = [];
  var removeText;
  var spaceCount = 0;
  try {
    if (hostname.includes(URLS.WIRED)) {
      author.push(
        document.getElementsByName('author')[0].content.replace(/,/g, '')
      );
      console.log(author);
    } else if (hostname.includes(URLS.CNN)) {
      removeText = document.getElementsByName('author')[0].content;
      console.log(removeText);
      removeText = removeText.substr(0, removeText.length - 5);
      if (removeText.includes('and')) {
        author = convertToArr(removeText);
      } else {
        author.push(removeText);
      }
      console.log(author);
    } else if (hostname.includes(URLS.VERGE)) {
      author.push(
        document.getElementsByTagName('meta')[5].content.replace(/,/g, '')
      );
      console.log(author);
    } else if (hostname.includes(URLS.VOX)) {
      author.push(
        document.getElementsByTagName('meta')[5].content.replace(/,/g, '')
      );
      console.log(author);
    } else if (hostname.includes(URLS.FOXNEWS)) {
      author.push(
        document.getElementsByName('dc.creator')[0].content.replace(/,/g, '')
      );
      console.log(author);
    } else if (hostname.includes(URLS.MEDIUM)) {
      author.push(
        document.getElementsByName('author')[0].content.replace(/,/g, '')
      );
      console.log(author);
    } else if (hostname.includes(URLS.NYTIMES)) {
      removeText = document.getElementsByName('byl')[0].content;
      removeText = removeText.replace('By ', '');
      if (removeText.includes('and')) {
        author = convertToArr(removeText);
      } else {
        author.push(removeText.replace(/,/g, ''));
      }
      console.log(author);
    } else {
      if (document.getElementsByName('author')[0].content != null) {
        author.push(
          document.getElementsByName('author')[0].content.replace(/,/g, '')
        );
      } else if (document.getElementsByTagName('meta')[5].content != null) {
        author.push(
          document.getElementsByTagName('meta')[5].content.replace(/,/g, '')
        );
      } else {
        return null;
      }
    }
    return author;
  } catch (e) {
    return null;
  }
}
