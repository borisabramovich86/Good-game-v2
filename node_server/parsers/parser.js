var request = require('request');
var cheerio = require('cheerio');
var Q = require('q');
var async = require('async');
var resultDataFactory = require('../models/ResultData');


function Parser() {
    this.ResultElement = "";
    this.AwayTeamLocator = "" ;
    this.HomeTeamLocator = "";
    this.TeamNameLocator = "";
    this.TeamScoreLocator = "";
    this.SiteUrl = "";
    this.YesterdaysGamesUrl = "";
    this.TomorrowGamesUrl = "";
    this.Overtime = "";
    this.UserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.122 Safari/534.30";
    this.checkIsGameOver;
    this.Promise = Q;
}

function parseUrl(url,that){

    console.log("Getting games from:" + url);
    var deferred = this.Promise.defer();
    var options = {
        url: url,
        headers: {
            'User-Agent': this.UserAgent
        }
    };
    var collection = [];

    request(options, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);


            $(that.ResultElement).filter(function() {

                var data = $(this);

                data.children().each(function(){

                    var resultData = resultDataFactory();

                    // Get away team details
                    resultData.AwayTeam.name = $(that.AwayTeamLocator + " " +  that.TeamNameLocator, this).text();
                    var away_score = $(that.AwayTeamLocator + " " +  that.TeamScoreLocator, this).text();
                    resultData.AwayTeam.score = that.checkIsGameOver(away_score);

                    // Get Home team details
                    resultData.HomeTeam.name = $(that.HomeTeamLocator + " " +  that.TeamNameLocator, this).text();
                    var home_score = $(that.HomeTeamLocator + " " +  that.TeamScoreLocator, this).text();
                    resultData.HomeTeam.score = that.checkIsGameOver(home_score);

                    // Check overtime
                    var overtimeText = $(that.Overtime, this).text();
                    resultData.Overtime = that.calculateOvertime(overtimeText);

                    that.calculateGameStatus(resultData);
                    collection.push(resultData);
                });
            });

            console.log('Finished parsing ' + url);
            deferred.resolve(collection);
        }
        else{
            deferred.reject("error");
        }

    });

    return deferred.promise;

}

Parser.prototype.calculateGameStatus = function(result){

    if(result.HomeTeam.score == -1 || result.AwayTeam.score == -1){
        result.Score = "unfinished";
    }
    var scoreDifference = Math.abs(result.HomeTeam.score - result.AwayTeam.score);

    if( scoreDifference < 10 || result.Overtime){
        result.WasItAGoodGame = true;
    }
};

Parser.prototype.parse = function() {

    var urlList = [];
    urlList.push(this.SiteUrl);
    urlList.push(this.YesterdaysGamesUrl);
    var deferred = this.Promise.defer();

    var that = this;

    async.parallel([
            function(callback){
                console.log('Getting today\'s games');
                parseUrl(that.SiteUrl,that).then(function(results){
                    callback(null, results);
                });

            },
            function(callback){
                console.log('Getting yesterday\'s games');
                // async code to get some data
                parseUrl(that.YesterdaysGamesUrl,that).then(function(results){
                    callback(null, results);
                });
            },
          function(callback){
              console.log('Getting tomorrow\'s games');
              // async code to get some data
              parseUrl(that.TomorrowGamesUrl,that).then(function(results){
                  callback(null, results);
              });
          }
        ],
        function(err, results){
            if(err){
                deferred.reject(err);
            }
            else{
                console.log('Finished getting all the games.');
                var result = {
                    "yesterday" : results[1]
                };
                if(areResultsSame(results[0],results[1],result)){
                    result["today"] =  results[2];
                }
                deferred.resolve(result);
            }
        });

    return deferred.promise;
};

function areResultsSame(todaysGames,yesterdaysGames,result) {
    var tmp1 = todaysGames;
    var tmp2 = yesterdaysGames;

    if(!IsYesterdayAndTodaySame(tmp1,tmp2)){
        result["today"] =  tmp1;
    }
}

function IsYesterdayAndTodaySame(todayResults, yesterdayResults){

    if(todayResults.length != yesterdayResults.length)
        return false;

    var areSame = true;
    for (var i = 0; i < todayResults.length; i++) {

        var tRes = todayResults[i];
        var yRes = yesterdayResults[i];
        var eq = tRes.equals(yRes);
        if(!eq) areSame = false;
    }

    return areSame;
}

module.exports = Parser;