let request = new XMLHttpRequest();
request.open('GET', 'https://api.github.com/repos/rails/rails');
request.responseType = 'json';

request.addEventListener('load', event => {
  // request.response will be the result of parsing the JSON response body
  // or null if the body couldn't be parsed or another error occurred
  let data = request.response;
  if (data) {
    // do something with the data
  } else console.log('Cannot parse the received response as JSON.');
});

request.send();
