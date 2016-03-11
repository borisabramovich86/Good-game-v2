var csv = require('csv-parser');
var fs = require('fs');
var Q = require('q');

function CsvParser() {
  this.Promise = Q;
}

CsvParser.prototype.parseFile = function(filePath) {

  var deferred = this.Promise.defer();
  var dates = [];
  var currDate = "";
  var previousDate = "";

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', function(data) {
      currDate = data.Date;
      if(currDate !== previousDate){
        dates.push(data.Date);
        previousDate = currDate;
      }
    })
    .on('end', function(){
      deferred.resolve(dates);
  });

  return deferred.promise;
};

module.exports = CsvParser;