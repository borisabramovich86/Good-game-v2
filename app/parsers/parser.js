var request = require('request');
var cheerio = require('cheerio');

function Parser() {
    this.ResultElement = "";
    this.AwayTeamLocator = "" ;
    this.HomeTeamLocator = "";
    this.TeamNameLocator = "";
    this.TeamScoreLocator = "";
    this.SiteUrl = "";
    this.YesterdaysGamesUrl = "";
    this.Overtime = "";
    this.UserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.122 Safari/534.30";
    this.checkIsGameOver;
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

Parser.prototype.parse = function(input, callback) {

    var urlList = [];
    var todaysGames = [];
    var yesterdaysGames = [];
    urlList.push(this.SiteUrl);
    urlList.push(this.YesterdaysGamesUrl);

    var that = this;
    var itemsProcessed = 0;
    urlList.forEach(function(entry){

        var options = {
            url: entry,
            headers: {
                'User-Agent': this.UserAgent
            }
        };

        request(options, function(error, response, html){

            if(!error){
                var $ = cheerio.load(html);
                var collection = entry === that.SiteUrl ? todaysGames : yesterdaysGames;

                $(that.ResultElement).filter(function() {

                    var data = $(this);

                    data.children().each(function(){

                        var resultData = {
                            AwayTeam : {
                                name : "",
                                score : ""
                            },
                            HomeTeam : {
                                name : "",
                                score : ""
                            },
                            Overtime: "",
                            WasItAGoodGame : false
                        };

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
                        console.log(resultData.AwayTeam.name + "-" + resultData.HomeTeam.name);
                    });
                });

                itemsProcessed++;
                if(itemsProcessed === urlList.length){
                    //areResultsSame(todaysGames,yesterdaysGames);
                    callback(null,{"today" : todaysGames,"yesterday" : yesterdaysGames});
                }
            }
        });

    });
};

function areResultsSame(todaysGames,yesterdaysGames) {
    console.log('all done');
    var tmp1 = todaysGames;
    var tmp2 = yesterdaysGames;

    resultList.remove(SiteUrl);
    resultList.remove(YesterdaysGamesUrl);

    resultList.put("yesterday",tmp2);

    if(!IsYesterdayAndTodaySame(tmp1,tmp2)){
        resultList.put("today", tmp1);
    }
}

module.exports = Parser;