var request = require('request');
var cheerio = require('cheerio');
var Q = require('q');
var async = require('async');
var tidy = require('htmltidy').tidy;
var scoreParserDataFactory = require('../models/ScoreParserData');

function Scraper(){
  this.Promise = Q;
};

function parseUrl(url){

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

        var scoreParserData = scoreParserDataFactory();
        var mainSelector = 'table.border_gray.x_small_text tr.valign_top > td:nth-child(1) ';

        var $ = cheerio.load(html);
        var ties = $(mainSelector + 'tr:nth-child(2) td:nth-child(2)').text();
        var leadChanges = $(mainSelector + 'tr:nth-child(3) td:nth-child(2)').text();
        var gameTied = $(mainSelector + 'tr:nth-child(4) td:nth-child(2)').text();
        var teamALead = $(mainSelector + 'tr:nth-child(5) td:nth-child(2)').text();
        var teamBLead = $(mainSelector + 'tr:nth-child(6) td:nth-child(2)').text();
        console.log('ties: ' + ties);
        console.log('lead changes: ' + leadChanges);
        console.log('game tied: ' + gameTied);
        console.log('team A lead: ' + teamALead);
        console.log('team B lead: ' + teamBLead);

        var winningTeam = $('#page_content div.float_left > table:nth-child(3) table:nth-child(1)').first().find('td:nth-child(1) a').first().text();
        var losingTeam = $('#page_content div.float_left > table:nth-child(3) table:nth-child(1)').first().find('td:nth-child(1) a').last().text();

        var quarter = 1;
        var team = winningTeam;
        $('#page_content div.float_left > table:nth-child(3) table:nth-child(1)').first().find('td.align_right').each(function(){
          if($(this).hasClass('bold_text')) {
            console.log(team + ' Final result ' + $(this).text());
            quarter = 1;
            team = losingTeam;
          }else{
            console.log(team + ' Quarter '+ quarter + ' ' + $(this).text());
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

        console.log(pbp);

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

  var linksArr = [];

  request(options, function(error, response, html){
    if(!error){

      tidy(html, function(err, html) {

        var $ = cheerio.load(html);

        $('#boxes .align_center > a:nth-child(2)').each(function(){
          linksArr.push('http://www.basketball-reference.com' + $(this).attr('href'));
        });

        async.each(linksArr,function(item, callback){
          parseUrl(item).then(function(results){
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