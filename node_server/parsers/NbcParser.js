function NbcParser(parser) {

    var getTodayDateWithoutOffset = function(){
        var dateObj = new Date();
        var _userOffset = dateObj.getTimezoneOffset()*60000;
        var dateWithOffset = new Date(dateObj.getTime() +_userOffset );
        dateWithOffset.setDate(dateWithOffset.getDate() - 1);
        return dateWithOffset;
    };

    var getFormattedDate = function(date){
        var month = '' + (date.getMonth() + 1);
        var day = '' + date.getDate();
        var year = date.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        var joinedDateString = [year, month, day].join('');
        return joinedDateString;
    };

    var setYesterdaysDateUrl = function(){

        var dateWithOffset = getTodayDateWithoutOffset();
        var formattedDate = getFormattedDate(dateWithOffset);
        parser.YesterdaysGamesUrl = parser.SiteUrl + "?day=" + formattedDate + "&meta=true";

    };

    this.checkIsGameOver = function(scoreText){

        var result = parseInt(scoreText);
        if(isNaN(result)){
            return -1;
        }
        else{
            return result;
        }

    };

    this.calculateOvertime = function(overtimeText){
        return overtimeText === "Final-OT";
    };

    this.parse = function() {
        return this.parser.parse();
    };

    parser.ResultElement = ".shsScoreboardCol";
    parser.AwayTeamLocator = "tr:nth-child(2)";
    parser.HomeTeamLocator = "tr:nth-child(3)";
    parser.TeamNameLocator = ".shsNamD a";
    parser.TeamScoreLocator = "td:nth-child(6)";
    parser.SiteUrl = "http://scores.nbcsports.msnbc.com/nba/scoreboard.asp";
    parser.Overtime = ".shsTeamCol.shsNamD";
    parser.UserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.122 Safari/534.30";
    setYesterdaysDateUrl();
    parser.checkIsGameOver = this.checkIsGameOver;
    parser.calculateOvertime = this.calculateOvertime;
    this.parser = parser;
}

module.exports = NbcParser;