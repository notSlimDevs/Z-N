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
    Crafty.background("url('/images/level 1.png')");
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

    _.each(players, function(player){
      if(player.username === myPlayer.username){
        //Set up my player
        ZombieWorld.currentPlayer = players[myPlayer.username];
      }else{
        //Rest of the players
        ZombieWorld.Players[player.username] = player;
      }
    });
  },

  newPlayer: function(player){
    ZombieWorld.Players[player.username] = player;

    ZombieWorld.Players[player.username].Entity = Crafty.e('Player, ' + player.type)
        .attr({
          x: player.x,
          y: player.y
        })
        .requires('Keyboard')
        .animate("walk_left", 0 , 1,  2)
        .animate("walk_right", 0 , 2 ,2)
        .animate("walk_up", 0,  3, 2)
        .animate("walk_down", 0, 0 , 2);
      
  },

  loadPlayers: function(){
    ZombieWorld.gameController.loadTeam();
    ZombieWorld.gameController.myPlayer();
  },

  loadTeam: function(){
    _.each(ZombieWorld.Players, function(player){
      if(!player.zombieController && !player.Entity){
        player.Entity = Crafty.e('Player, ' + player.type)
        .attr({
          x: player.x,
          y: player.y
        })
        .requires('Keyboard')
        .animate("walk_left", 0 , 1,  2)
        .animate("walk_right", 0 , 2 ,2)
        .animate("walk_up", 0,  3, 2)
        .animate("walk_down", 0, 0 , 2);
      }
    });
  },
  
  myPlayer: function(){
    var player = ZombieWorld.currentPlayer;
    if(!player.zombieController){

      player.Entity = Crafty.e('Player, ' + player.type)
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
      })
      .bind("EnterFrame", function(e) {
        if(this.isDown("LEFT_ARROW")) {
          this.emit('Move player', {x: this.x, y: this.y, to: "LEFT_ARROW"});
        } else if(this.isDown("RIGHT_ARROW")) {
          this.emit('Move player', {x: this.x, y: this.y, to: "RIGHT_ARROW"});
        } else if(this.isDown("UP_ARROW")) {
          this.emit('Move player', {x: this.x, y: this.y, to: "UP_ARROW"});
        } else if(this.isDown("DOWN_ARROW")) {
          this.emit('Move player', {x: this.x, y: this.y, to: "DOWN_ARROW"});
        }

        if(this.isDown("SPACE")){
          this.bullet();
        }

      })
      .onHit('Next', function(){
        console.log('Next level');
      });
    }
  }

};

var drawGrid = function(grid, cb){
  _.each(grid, function(x, xIndex){
    _.each(x, function(y, yIndex){

      var properties = {
        x: xIndex * ZombieWorld.Land.map.tile.width,
        y: yIndex * ZombieWorld.Land.map.tile.height,
        w: ZombieWorld.Land.map.tile.width,
        h: ZombieWorld.Land.map.tile.height 
      };

      switch(grid[xIndex][yIndex]){
        case 0:
          Crafty.e('Free').attr(properties);
          break;
        case 1:
          Crafty.e('Limit').attr(properties);
          break;
        case 2:
          Crafty.e('Barrel').attr(properties);
          break;
        case 4:
          Crafty.e('Next').attr(properties);
          break;
      }
    });
  });

  return cb();
};
