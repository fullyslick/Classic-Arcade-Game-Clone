// Enemies our player must avoid
var Enemy = function( posY) {
    // Holds the default x position of all enemies.
    // They all should appear from the most left postion just before the canvas.
    this.defaultX = -83;

    // Holds the starting x postion of enemies.
    this.x = this.defaultX;

    // Holds the starting y postion of enemies.
    this.y = posY;

    // These are the 3 options of the y postion where the enemy can reapear when it leaves the canvas
    this.yOptions = [225, 142, 59];

    // Returns a random value from the yOptions
    this.changeY = function(){
      return this.yOptions[Math.floor(Math.random() * this.yOptions.length)];
    };

    // There are 3 different values for speed: slow, medium, fast
    this.speedOptions = [200, 300, 400];

    // Returns a random value from the speedOptions
    this.chooseSpeed = function(){
      return this.speedOptions[Math.floor(Math.random() * this.speedOptions.length)];
    };

    // Assign the return value of chooseSpeed() method to the speed property of the Enemy objects,
    // so when it first appear it will get 1 of the 3 posibble speeds
    this.speed = this.chooseSpeed();

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += this.speed * dt;

  // When enemy goes out the canvas it should reappear again on left
  if (this.x > canvas.width) {

  // Set the enemy to the left most position ( defaultX ).
  this.x = this.defaultX;

  // Assign random Y postion of enemy from the 3 posibble options
  this.y = this.changeY();

  // And change the speed of the enemy when it reapers
  this.speed = this.chooseSpeed();
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
var Player = function(){
  this.x = 202;
  this.y = 380;
  this.sprite = "images/char-boy.png";
}
// This class requires an update(), render() and
// a handleInput() method.

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Now instantiate your objects.
// Creating enemy objects
const bugOne = new Enemy(59);

// Place all enemy objects in an array called allEnemies
const allEnemies = [bugOne];
// Place the player object in a variable called player
const player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
