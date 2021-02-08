let express = require('express');
let router = express.Router();

router.get('/areas_of_continents', (req, res, next) => {
  let continents = {
    asia: 43820000,
    africa: 30370000,
    north_america: 24490000,
    south_america: 17840000,
    antarctica: 13720000,
    europe: 10180000,
    australia: 9008500
  };

  // Note: for results consistent w/ those in the instructions,
  //   use Chrome to send the req from the 2nd server
  // Originally, we have no 'Access-Control-Allow-Origin' header ...
  // res.set('Access-Control-Allow-Origin', 'http://example.com'); // incorrect req origin
  res.set('Access-Control-Allow-Origin', 'http://localhost:8080'); // correct req origin
  // res.set('Access-Control-Allow-Origin', '*'); // also works

  res.json(continents);
});

module.exports = router;
