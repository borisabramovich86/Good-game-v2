var request = require('request');
var cheerio = require('cheerio');
var Q = require('q');
var async = require('async');
var tidy = require('htmltidy').tidy;
var scraperData = require('../models/ScoreParserData');
var Game = require('../models/game');

function Scraper(){
  this.Promise = Q;
};

function parseUrl(url, date){

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

      tidy(html, function(err, html) {

        var game = scraperData();
        game.date = date;
        var firstTeam = {
          by_quarter: []
        };
        var secondTeam = {
          by_quarter: []
        };

        var $ = cheerio.load(html);

        var mainSelector = 'table.border_gray.x_small_text tr.valign_top > td:nth-child(1) ';

        var teamA = $('#page_content div.float_left > table:nth-child(3) table:nth-child(1)').first().find('td:nth-child(1) a').first().text();
        var teamB = $('#page_content div.float_left > table:nth-child(3) table:nth-child(1)').first().find('td:nth-child(1) a').last().text();

        firstTeam.name = teamA;
        secondTeam.name = teamB;
        game.ties = parseInt($(mainSelector + 'tr:nth-child(2) td:nth-child(2)').text());
        game.lead_changes = parseInt($(mainSelector + 'tr:nth-child(3) td:nth-child(2)').text());
        game.game_tied = $(mainSelector + 'tr:nth-child(4) td:nth-child(2)').text();
        firstTeam.lead = $(mainSelector + 'tr:nth-child(5) td:nth-child(2)').text();
        secondTeam.lead = $(mainSelector + 'tr:nth-child(6) td:nth-child(2)').text();


        var quarter = 1;
        var team = firstTeam;
        $('#page_content div.float_left > table:nth-child(3) table:nth-child(1)').first().find('td.align_right').each(function(){
          if($(this).hasClass('bold_text')) {
            team.score = parseInt($(this).text());
            quarter = 1;
            team = secondTeam;
          }else{
            team.by_quarter.push($(this).text());
            quarter++;
          }
        });

        var score = '';
        var pbp = $('#page_content > table td > div:nth-child(3) > table.no_highlight.stats_table').find('td:nth-child(4)').map(function(){
          if(score !== $(this).text()){
            score = $(this).text();
            return $(this).text();
          }
        }).get().join(',');

        game.progress = pbp;

        if(parseInt(firstTeam.score) > parseInt(secondTeam.score)){
          firstTeam.won = true;
          secondTeam.won = false;
        }
        else{
          secondTeam.won = true;
          firstTeam.won = false;
        }

        game.teams.push(firstTeam);
        game.teams.push(secondTeam);
        var CurrentGame = new Game(game);
        CurrentGame.save(function (err, result) {
          if (err) {
            return console.error(err);
          }
          console.log('Game saved successfully! ' + result._id);
        });
        console.log('Finished parsing ' + url);
        deferred.resolve(collection);
      });

    }
    else{
      deferred.reject("error");
    }

  });

  return deferred.promise;

}

Scraper.prototype.scrape = function(){

  var deferred = this.Promise.defer();
  var options = {
    url: 'http://www.basketball-reference.com/boxscores/index.cgi?month=10&day=28&year=2014',
    headers: {
      'User-Agent': this.UserAgent
    }
  };

  var month = options.url.substr(options.url.indexOf("month=") + 6,2);
  var day = options.url.substr(options.url.indexOf("day=") + 4,2);
  var year = options.url.substr(options.url.indexOf("year=") + 5,4);
  var date = new Date(year + "-" + month + "-" + day);

  var linksArr = [];

  request(options, function(error, response, html){
    if(!error){

      tidy(html, function(err, html) {

        var $ = cheerio.load(html);

        $('#boxes .align_center > a:nth-child(2)').each(function(){
          linksArr.push('http://www.basketball-reference.com' + $(this).attr('href'));
        });

        async.each(linksArr,function(item, callback){
          parseUrl(item,date).then(function(results){
            callback(null, results);
          });
        })
      });


      deferred.resolve("yes");
    }
    else{
      deferred.reject("error");
    }
  });

  return deferred.promise;
};

module.exports = Scraper;