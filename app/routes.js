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
		var nbcParser = new NbcParser (parser);
		var promise = new Promise(function (resolve, reject) {
			nbcParser.parse(null, function(err, result){
				if(err){
					reject(err);
				} else {
					resolve(result);
				}
			});
		});

		promise.then(function(successResponse) {
			res.json(successResponse)
			res.end();;
		}, function(errorResponse) {
			console.log(errorResponse + ' No it failed');
		});
	});

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};