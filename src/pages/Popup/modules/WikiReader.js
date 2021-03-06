import axios from 'axios';

function getPromise() {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve({
        country: 'India',
      });
    }, 2000);
  });
}

function getResult(response) {
  getPromise().then(function (response) {
    return response;
  });
}

async function readURL(name) {
  console.log(name);
  let wikipediaURL = correctApiUrl(name);
  console.log(wikipediaURL);
  let extractedHTMLData;
  // let promise = await
  return axios
    .get(wikipediaURL)
    .then((response) => {
      extractedHTMLData = response.data.query.pages;
      var id = 0;
      for (const key in extractedHTMLData) {
        id = key;
      }
      extractedHTMLData = extractedHTMLData[id].extract;
      console.log('HTML:', extractedHTMLData);
      return extractedHTMLData;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

function correctApiUrl(authorName) {
  let string = 'https://en.wikipedia.org/w/api.php?';
  string += 'action=query&format=json&prop=extracts&exintro&titles=';
  string +=
    authorName == 'Melissa Bell' ? authorName + '_(journalist)' : authorName;
  // string += '&exsentences=1';
  string += '&origin=*';
  string = string.replace(' ', '%20');
  return string;
}

export default readURL;
