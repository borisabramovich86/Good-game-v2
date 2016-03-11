var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GameSchema = new Schema({
    date            : Date
  , ties            : Number
  , lead_changes    : Number
  , game_tied       : String
  , progress        : String
  , teams           : [{
    name            : String,
    won             : Boolean,
    score           : Number,
    lead            : String,
    by_quarter      : [String]

  }]
});

var Game  = mongoose.model('Game', GameSchema);
module.exports = Game;