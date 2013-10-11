var Grid1 = require('../grids/room');
var Grid2 = require('../grids/room');
var Grid3 = require('../grids/room');

var Levels = {
  1: Grid1,
  2: Grid2,
  3: Grid3
};

var Configuration = {
  width: 0,
  height: 0,
  title: {
    width: 0,
    heigth: 0
  }
};

//Players
var player1 = {
  speed: 0
};
var player2 = {
  speed: 0
};
var player3 = {
  speed: 0
};

//Zombies
var zombie1 = {
  speed: 0
};
var zombie2 = {
  speed: 0
};
var zombie3 = {
  speed: 0
};

//Send map configuration
module.exports.map = function(level){
  return{

    map: {
      Grid: Levels[level],
      width: Configuration.width,
      heigth: Configuration.heigth,
      title: Configuration.title
    },

    players: {
      player1: player1,
      player2: player2,
      player3: player3
    },

    zombies: {
      zombie1: zombie1,
      zombie2: zombie2,
      zombie3: zombie3
    }

  };
};
