import axios from 'axios';


function getPromise() {
  return new Promise(function(resolve, reject) {
      setTimeout(function() {
          resolve({
              'country': 'India'
          });
      }, 2000)
  })
}

function getResult(response) {
  getPromise()
      .then(function(response) {
          return response;
      })
}

 async function readURL(name) {
    let test = correctApiUrl(name);
    console.log(test);
    let dummy;
    let promise = await axios.get(test).then(response => {
      dummy = response.data.query.pages;
      var id = 0;
      for (const key in dummy) {
        id = key;
      }
      dummy = dummy[id].extract;
      return response;
    }).catch(error => {
      console.log(error);
    });
    console.log("DUMMY");
    console.log(dummy);
    console.log(typeof(dummy));
    console.log(dummy instanceof Promise);
    return dummy;
}

function correctApiUrl(authorName) {
  let string = 'https://en.wikipedia.org/w/api.php?';
  string += 'action=query&format=json&prop=extracts&exintro&titles=';
  string += authorName;
  string += '&exsentences=2';
  string += '&origin=*';
  string = string.replace(' ', '%20');
  return string
}

export default readURL;