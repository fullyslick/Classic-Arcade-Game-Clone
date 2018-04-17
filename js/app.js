// Enemies our player must avoid
var Enemy = function(posX, posY) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = posX;
    this.y = posY;

    // there are 3 different values for speed: slow, medium, fast
    this.speedOptions = [200, 300, 400];

    // this function chooses returns a random value from the speedOptions
    this.chooseSpeed = function(){
      return this.speedOptions[Math.floor(Math.random() * this.speedOptions.length)];
    };

    // assign the return value of chooseSpeed() method to the speed property of the Enemy objects
    this.speed = this.chooseSpeed();

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += this.speed * dt;

  // When enemy goes out the canvas it should reappear again on left
  if (this.x > canvas.width) {

  // Set the enemy to the left most position
  this.x = 0;

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
const bugOne = new Enemy(10, 225);

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
