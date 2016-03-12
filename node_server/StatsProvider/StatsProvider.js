var Game = require('../models/Game');
var Q = require('q');

function StatsProvider(){
  this.Promise = Q;
}

function calculateGoodGame(game){
  if (Math.abs(game.teams[0].score - game.teams[1].score) < 8){
    return true;
  }
  return false;
};

StatsProvider.prototype.updateGoodGame = function(){
  var deferred = this.Promise.defer();

  Game.find({},function(err,games){
    if(err){
      console.log(err);
      deferred.reject("error");
    }
    if(games){
      games.forEach(function(item){
        item.good_game = calculateGoodGame(item);
        item.save(function(err) {
          if (err)
            console.log('error updating item');
          else
            console.log('success updating item!');
        });
      });

      deferred.resolve(games);
    }
  });

  return deferred.promise;
};

StatsProvider.prototype.getTeamStats = function(teamName) {
  var deferred = this.Promise.defer();
  Game.find({'teams.name': teamName}, function(err, games){
    if(err){
      console.log(err);
      deferred.reject("error");
    }
    if(games){

      var overallGames = games.length;
      var goodGames = 0;

      for(var i = 0; i < games.length; ++i){
        if(games[i].good_game == true)
          goodGames++;
      }

      const goodGamePercentage = (goodGames / overallGames * 100).toFixed(2);
      console.log(teamName + ' Good Game percentage: ' + goodGamePercentage + '%');
      deferred.resolve(goodGamePercentage.toString());
    }
  });

  return deferred.promise;
};

module.exports = StatsProvider;