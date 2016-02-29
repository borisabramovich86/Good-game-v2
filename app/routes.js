var Parser = require('../app/parsers/parser');
var NbcParser = require('../app/parsers/NbcParser');
var Promise = require('bluebird');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// sample api route
	app.get('/api/scores', function(req, res) {
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

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};