// @constructor Enemy constructor from which the enemies will be built.
var Enemy = function(posY) {
  // Holds the default x position of all enemies.
  // They all should appear from the most left position just before the canvas.
  this.defaultX = -83;

  // Holds X position of enemies.
  // When created, every enemy takes the default X position.
  this.x = this.defaultX;

  // Holds Y position of enemies.
  this.y = posY;

  // These are the 3 options of the Y position where the enemy can reappear when it leaves the canvas.
  this.yOptions = [225, 142, 59];

  // Returns a random value from the yOptions.
  this.changeY = function() {
    return this.yOptions[Math.floor(Math.random() * this.yOptions.length)];
  };

  // These are the 3 different values for speed: slow, medium, fast.
  this.speedOptions = [200, 300, 400];

  // Returns random value from the speedOptions.
  this.chooseSpeed = function() {
    return this.speedOptions[Math.floor(Math.random() * this.speedOptions.length)];
  };

  // Assign the return value of chooseSpeed() method to the speed property of the Enemy objects,
  // so when they first appear or reappears, they will get 1 of the 3 possible speeds.
  this.speed = this.chooseSpeed();

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images.
  this.sprite = 'images/enemy-bug.png';
};

// @param {number} dt, a time delta between ticks.
// @description Updates the position of every enemy object.
Enemy.prototype.update = function(dt) {
  // Multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += this.speed * dt;

  // When enemy goes out the canvas it should reappear again on the left.
  if (this.x > canvas.width) {

    // Set the enemy to the left most position ( defaultX ), just before the canvas.
    this.x = this.defaultX;

    // Assign random Y position of enemy from the 3 possible options.
    this.y = this.changeY();

    // Change the speed of the enemy when it reapers.
    this.speed = this.chooseSpeed();
  }

  /*
   * Check for collisions between player and enemies.
   * If the player is on enemy register a collision.
   * Right bound of enemy = enemy.x + 101;
   * Right bound of player = player.x + 81; (Player appears a bit narrow).
   */
  if (player.y == this.y && player.x < this.x + 81 && player.x + 81 > this.x) {

    // Game should over, because the player dies.
    isGameOver = true;

    // Change the reason of game over to notify reset(), which will show a red screen and restart the game.
    whyGameIsOver = "Collision";
  }
};

// @description Draw the enemy on the screen, required method for game.
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// @constructor The player class from which the player will be built.
var Player = function() {
  // Holds the default X position of player.
  this.defaultX = 202;

  // Holds the default Y position of player.
  this.defaultY = 391;

  // Holds X postion of player.
  this.x = this.defaultX;

  // Holds Y postion of player.
  this.y = this.defaultY;

  // Holds the value movement on X axis.
  // Will be modfied by Player.prototype.handleInput method.
  this.moveXWith = 0;

  // Holds the value movement on Y axis.
  // Will be modfied by Player.prototype.handleInput method.
  this.moveYWith = 0;

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images.
  this.sprite = "images/char-boy.png";
}

// @description Required method by engine.js to display the player on the canvas.
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// @description Update the player's position across the canvas, required method for game by engine.js.
Player.prototype.update = function() {

  /*
   * The X position of the player changes
   * depending on the value of 'moveXWith' set by handleInput method.
   */
  this.x += this.moveXWith;


  // Reset to 0 or the player will continue to move and will go out of the canvas.
  this.moveXWith = 0;

  /*
   * The Y position of the player changes
   * depending on the value of 'moveYWith' set by handleInput method.
   */
  this.y += this.moveYWith;

  // Reset to 0 or the player will continue to move and will go out of the canvas.
  this.moveYWith = 0;

  // Detect if the player has reached the winning position (blue waters).
  if (this.y == -24) {

    // Game is now over this will trigger reset() method in engine.js
    isGameOver = true;

    // Notifies reset() method in engine.js to implement proper behavior.
    whyGameIsOver = "Success";
  }
};

/*
 * @description Handles the keyboard input for the player object.
 * Called from the event listener at the bottom.
 */
Player.prototype.handleInput = function(keyPressed) {

  /*
   * Block player from moving when game is over.
   * So if game is not over it can move.
   */
  if (!isGameOver) {

    // Changes the moveXWith or moveYWith value depending on key pressed.
    switch (keyPressed) {
      case 'up':
        // If player is at the top boundary prevent its movement (prevents it from moving out of canvas).
        if (this.y <= -24) {
          this.moveYWith = 0;
        } else {

          // If it the pressed button is 'up' and it's below top boundary of canvas,
          // change the Y position of player with -83.
          // This happens in Player.prototype.update above.
          this.moveYWith = -83;
        }
        break;

      case 'down':
        // If player is at the bottom boundary prevent its movement (prevents it from moving out of canvas).
        if (this.y >= 391) {
          this.moveYWith = 0;
        } else {

          // If it the pressed button is 'down' and it's below bottom boundary of canvas,
          // change the Y position of player with 83.
          // This happens in Player.prototype.update above.
          this.moveYWith = 83;
        }
        break;

      case 'right':
        // If player is at the right boundary prevent its movement (prevents it from moving out of canvas).
        if (this.x == 404) {
          this.moveXWith = 0;
        } else {

          // If it the pressed button is 'right' and it's right next to right boundary of canvas,
          // change the X position of player with 101.
          // This happens in Player.prototype.update above.
          this.moveXWith = 101;
        }
        break;

      case 'left':
        // If player is at the leftt boundary prevent its movement (prevents it from moving out of canvas).
        if (this.x == 0) {
          this.moveXWith = 0;
        } else {

          // If it the pressed button is 'left' and it's right next to left boundary of canvas,
          // change the X position of player with -101.
          // This happens in Player.prototype.update above.
          this.moveXWith = -101;
        }
        break;
    }
  }
};

/*
 * @description Reset the position of player method.
 * Called from engine.js reset() method when game is over.
 */
Player.prototype.resetPosition = function() {

  this.x = this.defaultX;
  this.y = this.defaultY;

};

// Create enemy object one, should appear at the highest possible line.
const bugOne = new Enemy(59);

// Create enemy object two, should appear on the middle line.
const bugTwo = new Enemy(142);

// Create enemy object three, should appear on the lower line.
const bugThree = new Enemy(225);

// Place all enemy objects in an array called allEnemies.
const allEnemies = [bugOne, bugTwo, bugThree];

// Create the player object and place it in a variable called player.
const player = new Player();

/*
 * Listen for key press and
 * send a string to layer.handleInput() method depending key pressed
 */
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
