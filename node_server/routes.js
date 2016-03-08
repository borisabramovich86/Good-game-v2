var Parser = require('../node_server/parsers/parser');
var NbcParser = require('../node_server/parsers/NbcParser');
var Scraper = require ('../node_server/scrapers/basketballReferenceScraper');

module.exports = function (app) {

  // server routes ===========================================================
  // handle things like api calls
  // authentication routes

  // Get Today and Yesterday's scores
  app.get('/api/scores', function (req, res) {
    // use mongoose to get all nerds in the database
    console.log('Getting scores...');
    var parser = new Parser();
    var nbcParser = new NbcParser(parser);
    nbcParser.parse()
      .then(function (result) {
        res.json(result);
        res.end();
      })
      .fail(function (error) {
        // error returns error message if either first or last name are null or undefined
        console.log('An error occurred: ' + error);
      });
  });

  // Scrape basketball reference data
  app.get('/api/scrape', function (req, res) {

    console.log('starting to scrape');
    var scraper = new Scraper();
    scraper.scrape()
      .then(function(result){
        res.write(result);
        res.end();
      })
      .fail(function(error){
        console.log('Scraping resulted in an error!');
        console.log(error);
      })
    });

  // frontend routes =========================================================
  // route to handle all angular requests
  app.get('*', function (req, res) {
    res.sendfile('./build/index.htm');
  });

};