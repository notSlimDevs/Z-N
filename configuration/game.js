var Grid1 = require('../grids/room1');
var Grid2 = require('../grids/room2');
var Grid3 = require('../grids/room3');

var Levels = {
  1: Grid1,
  2: Grid2,
  3: Grid3
};

var Configuration = {
  width: 52,
  height: 27,
  title: {
    width: 20,
    height: 20
  }
};

//Players
var player1 = {
  speed: 2
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
      height: Configuration.height,
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
