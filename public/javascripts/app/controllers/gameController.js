ZombieWorld.gameController = {

  loadSprites: function(){
      ZombieWorld.sprites = {

        players: Crafty.sprite(32, "/images/power-tanger.png", {
          player1: [0,0]
        })

      };
  },

  getConfiguration: function(cb){
    var self = this;

    var timer = setInterval(function(){
      //Wait for level of current player
      if(ZombieWorld.currentPlayer){ 
        clearInterval(timer); 
        var level = ZombieWorld.currentPlayer.level;
        $.get('/configuration?level='+level).done(function(configuration){
          ZombieWorld.Land = configuration;
          self.loadSprites();
          return cb();
        });
      }
    }, 200);


  },

  generateLevel: function(cb){
    //Ask server for level
    Crafty.background('rgb(141,131,121)');
    drawGrid(ZombieWorld.Land.map.Grid, function(){
      console.log('Map drawn');
      return cb();
    });
  },

  setPlayers: function(players){
    var myPlayer = JSON.parse(localStorage.getItem('Player'));

    if(!players[myPlayer.username]){
      return alert('You are not on the server');
    }

    ZombieWorld.currentPlayer = players[myPlayer.username];
    ZombieWorld.players = players;
  },


  loadPlayers: function(){
    var players = ZombieWorld.players;

    _.each(players, function(player){
      console.log(player);

      Crafty.e('Player, ' + player.type)
          .attr({
            x: player.x,
            y: player.y
          })
          .requires('Keyboard')
          .animate("walk_left", 0 , 1,  2)
          .animate("walk_right", 0 , 2 ,2)
          .animate("walk_up", 0,  3, 2)
          .animate("walk_down", 0, 0 , 2)
          .fourway(player.speed)
          .bind('NewDirection', function(data) {
            if (data.x > 0) {
              this.animate('walk_right', player.speed, -1);
            } else if (data.x < 0) {
              this.animate('walk_left', player.speed, -1);
            } else if (data.y > 0) {
              this.animate('walk_down', player.speed, -1);
            } else if (data.y < 0) {
              this.animate('walk_up', player.speed, -1);
            } else {
              this.stop();
            }
          });
    });

  }

};

var drawGrid = function(grid, cb){
  _.each(grid, function(x, xIndex){
    _.each(x, function(y, yIndex){

      var coordinates = {
        x: xIndex * ZombieWorld.Land.map.tile.width,
        y: yIndex * ZombieWorld.Land.map.tile.height
      };

      switch(grid[xIndex][yIndex]){
        case 0:
          break;
        case 1:
          Crafty.e('Limit').attr({
          x: coordinates.x,
          y: coordinates.y,
          w: ZombieWorld.Land.map.tile.width,
          h: ZombieWorld.Land.map.tile.height 
        });
          break;
        case 2:
          Crafty.e('Barrel').attr({
          x: coordinates.x,
          y: coordinates.y,
          w: ZombieWorld.Land.map.tile.width,
          h: ZombieWorld.Land.map.tile.height 
        });
          break;
      }
    });
  });

  return cb();
};
