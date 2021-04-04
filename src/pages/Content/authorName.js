import { URLS } from '../Background/workingUrls';

export function authorName(hostname) {
    var author = [];
    var removeText;
    var spaceCount = 0;
    try {

      if (hostname.includes(URLS.WIRED)) {
        author.push(document.getElementsByName('author')[0].content);
        console.log(author);
      } else if (hostname.includes(URLS.CNN)) {
        removeText = document.getElementsByName('author')[0].content;
        removeText = removeText.substr(0, removeText.length - 5);
        if (removeText.includes('and')) {
          removeText = removeText.replace('and ', '');
          for (let i in removeText) {
            if (spaceCount == 2) {
              author.push(removeText.substr(0, i - 1));
              author.push(removeText.substr(i));
              spaceCount += 1;
            }
            if (removeText[i].includes(' ')) {
              spaceCount += 1;
            }
          }
        } else {
          author.push(removeText);
        }
        console.log(author);
      } else if (hostname.includes(URLS.VERGE)) {
        author.push(document.getElementsByTagName('meta')[5].content);
        console.log(author);
      } else if (hostname.includes(URLS.VOX)) {
        author.push(document.getElementsByTagName('meta')[5].content);
        console.log(author);
      } else if (hostname.includes(URLS.FOXNEWS)) {
        author.push(document.getElementsByName('dc.creator')[0].content);
        console.log(author);
      } else if (hostname.includes(URLS.MEDIUM)) {
        author.push(document.getElementsByName('author')[0].content);
        console.log(author);
      } else if (hostname.includes(URLS.NYTIMES)) {
        removeText = document.getElementsByName('byl')[0].content;
        removeText = removeText.replace('By ', '');
        if (removeText.includes('and')) {
          removeText = removeText.replace('and ', '');
          for (let i in removeText) {
            if (spaceCount == 2) {
              author.push(removeText.substr(0, i - 1));
              author.push(removeText.substr(i));
              spaceCount += 1;
            }
            if (removeText[i].includes(' ')) {
              spaceCount += 1;
            }
          }
        } else {
          author.push(removeText);
        }
        console.log(author);
      } else {
        if (document.getElementsByName('author')[0].content != null) {
          author.push(document.getElementsByName('author')[0].content);
        } else if (document.getElementsByTagName('meta')[5].content != null) {
          author.push(document.getElementsByTagName('meta')[5].content);
        } else {
          author.push('Sorry IDK');
        }
      }
      return author;
    } catch (e) {
      return null
    }
  }