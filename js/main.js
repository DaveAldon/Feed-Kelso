//this game will have only 1 state
var GameState = {
  //load the game assets before the game starts
  preload: function() {
    this.game.load.image('background', 'assets/images/room.png');    
    this.game.load.image('pancakes', 'assets/images/pancakes.png');    
    this.game.load.image('beer', 'assets/images/beer.png');    
    this.game.load.image('rotate', 'assets/images/rotate.png');    
    this.game.load.image('ps4', 'assets/images/ps4.png');    
    this.game.load.image('arrow', 'assets/images/arrow.png');   
    this.load.spritesheet('kelso', 'assets/images/kelso.png', 97, 83, 5, 1, 1); 
  },
  //executed after everything is loaded
  create: function() { 
    //scaling options
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    //have the game centered horizontally
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    //screen size will be set automatically
    this.scale.setScreenSize(true);
      
    this.background = this.game.add.sprite(0,0, 'background');
    this.background.inputEnabled = true;
    this.background.events.onInputDown.add(this.placeItem, this);

    this.kelso = this.game.add.sprite(100, 400, 'kelso',0);
    this.kelso.animations.add('funnyfaces', [0, 1, 2, 3, 2, 1, 0], 7, false);
    this.kelso.anchor.setTo(0.5);

    //custom properties of Kelso
    this.kelso.customParams = {health: 100, fun: 100};

    //draggable Kelso
    this.kelso.inputEnabled = true;
    this.kelso.input.enableDrag();
    
    //buttons
    this.pancakes = this.game.add.sprite(72, 570, 'pancakes');
    this.pancakes.anchor.setTo(0.5);
    this.pancakes.customParams = {health: 20};
    this.pancakes.inputEnabled = true;
    this.pancakes.events.onInputDown.add(this.pickItem, this);

    this.beer = this.game.add.sprite(144, 570, 'beer');
    this.beer.anchor.setTo(0.5);
    this.beer.customParams = {health: -10, fun: 10};
    this.beer.inputEnabled = true;
    this.beer.events.onInputDown.add(this.pickItem, this);

    this.ps4 = this.game.add.sprite(216, 570, 'ps4');
    this.ps4.anchor.setTo(0.5);
    this.ps4.customParams = {fun: 30};
    this.ps4.inputEnabled = true;
    this.ps4.events.onInputDown.add(this.pickItem, this);

    this.rotate = this.game.add.sprite(288, 570, 'rotate');
    this.rotate.anchor.setTo(0.5);
    this.rotate.inputEnabled = true;
    this.rotate.events.onInputDown.add(this.rotatePet, this);

    this.buttons = [this.pancakes, this.beer, this.ps4, this.rotate];

    //nothing selected
    this.selectedItem = null;

    //stats
    var style = { font: "20px Arial", fill: "#fff"};
    this.game.add.text(10, 20, "Health:", style);
    this.game.add.text(140, 20, "Fun:", style);

    this.healthText = this.game.add.text(80, 20, "", style);
    this.funText = this.game.add.text(185, 20, "", style);
    this.refreshStats();

    //decrease health and fun every 10 seconds
    this.statsDecreaser = this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.reduceProperties, this);
    this.statsDecreaser.timer.start();
    
    this.uiBlocked = false;
  },

  //rotate Kelso
  rotatePet: function(sprite, event) {

    if(!this.uiBlocked) {
      this.uiBlocked = true;

      //alpha to indicate selection
      this.clearSelection();
      sprite.alpha = 0.4;
      
      //vibrate device if present
      if(navigator.vibrate) {
        navigator.vibrate(1000);
      }
      
      var petRotation = game.add.tween(this.kelso);
      petRotation.to({ angle: '+720' }, 1000);
      petRotation.onComplete.add(function(){
        this.uiBlocked = false;
        sprite.alpha = 1;
        this.kelso.customParams.fun += 10;

        //show updated stats
        this.refreshStats();
      }, this);
      petRotation.start();
    }
  },

  //pick an item so that you can place it on the background
  pickItem: function(sprite, event) {
    if(!this.uiBlocked) {
      //clear other buttons
      this.clearSelection();

      //alpha to indicate selection
      sprite.alpha = 0.4;

      //save selection so we can place an item
      this.selectedItem = sprite;
    }
  },

  //place selected item on the background
  placeItem: function(sprite, event) {
    if(this.selectedItem && !this.uiBlocked) {
      //position of the user input
      var x = event.position.x;
      var y = event.position.y;

      //create element in this place
      var newItem = this.game.add.sprite(x, y, this.selectedItem.key);
      newItem.anchor.setTo(0.5);
      newItem.customParams = this.selectedItem.customParams;

      //Kelso will move to grab the item
      this.uiBlocked = true;
      var petMovement = game.add.tween(this.kelso);
      petMovement.to({x: x, y: y}, 700);
      petMovement.onComplete.add(function(){
        this.uiBlocked = false;

        //destroy item
        newItem.destroy();

        //animate Kelso
        this.kelso.animations.play('funnyfaces');

        //update Kelso stats
        var stat;
        for(stat in newItem.customParams) {
          //make sure the property belongs to the object and not the prototype
          if(newItem.customParams.hasOwnProperty(stat)) {
            this.kelso.customParams[stat] += newItem.customParams[stat];
          }
        }
        
        //show updated stats
        this.refreshStats();

        //clear selection
        this.clearSelection();
      }, this);
      petMovement.start();      
    }
  },
  //clear all buttons from selection
  clearSelection: function() {
    //set alpha to 1
    this.buttons.forEach(function(element){element.alpha = 1});

    //clear selection
    this.selectedItem = null;
  },
  //show updated stats values
  refreshStats: function() {
    this.healthText.text = this.kelso.customParams.health;
    this.funText.text = this.kelso.customParams.fun;
  },
  
  //Kelso slowly becomes less health and bored
  reduceProperties: function() {
    this.kelso.customParams.health = Math.max(0, this.kelso.customParams.health - 20);
    this.kelso.customParams.fun = Math.max(0, this.kelso.customParams.fun - 30);
    this.refreshStats();
  },

  //game loop, executed many times per second
  update: function() {
    score = this.kelso.customParams.health;
    if(this.kelso.customParams.health <= 0 || this.kelso.customParams.fun <= 0) {
      this.kelso.customParams.health = 0;
      this.kelso.customParams.fun = 0;
      this.kelso.frame = 4;
      this.uiBlocked = true;

      this.game.time.events.add(2000, this.gameOver, this);
    }
  },
  gameOver: function() {    
    this.game.state.restart();
  },
};

//Add the function for the restart button
function gamerestart() {
	game.start.restart();
}

//initiate the Phaser framework
var game = new Phaser.Game(360, 640, Phaser.AUTO, 'gamewindow');

game.state.add('GameState', GameState);
game.state.start('GameState');