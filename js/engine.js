/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
  /* Predefine the variables we'll be using within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
   */
  var doc = global.document,
    win = global.window,
    canvas = doc.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    lastTime;

  canvas.width = 505;
  canvas.height = 606;
  doc.body.appendChild(canvas);

  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   */
  function main() {
    /* Get our time delta information which is required if your game
     * requires smooth animation. Because everyone's computer processes
     * instructions at different speeds we need a constant value that
     * would be the same for everyone (regardless of how fast their
     * computer is) - hurray time!
     */
    var now = Date.now(),
      dt = (now - lastTime) / 1000.0;

    /* Call our update/render functions, pass along the time delta to
     * our update function since it may be used for smooth animation.
     */
    update(dt);
    render();

    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     * This is what is used instead of interval. This creates the loop of frames.
     */
    win.requestAnimationFrame(main);

    /*
     * Check if the game is over.
     * The variable isGameOver is changes in the Player.prototype.update, when player reach win position.
     * The variable isGameOver is changes in the Enemy.prototype.update, when collision is detected.
     */
    if (isGameOver) {
      // If game is over call the reset() method, to reset the game.
      reset();
    }
  }

  /* @description Does some initial setup that should only occur once,
   * particularly setting the lastTime variable that is required for the
   * game loop.
   */
  function init() {
    reset();
    lastTime = Date.now();
    main();
  }

  /*
   * @description This function is called by main (our game loop) and itself calls all
   * of the functions which may need to update entity's data.
   */
  function update(dt) {
    updateEntities(dt);
  }

  /*
   * @description This is called by the update function and loops through all of the
   * objects within your allEnemies array as defined in app.js and calls
   * their update() methods. It will then call the update function for your
   * player object. These update methods should focus purely on updating
   * the data/properties related to the object.
   */
  function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });
    player.update();
  }

  /*
   * @description This function initially draws the "game level", it will then call
   * the renderEntities function. Remember, this function is called every
   * game tick (or loop of the game engine) because that's how games work -
   * they are flipbooks creating the illusion of animation but in reality
   * they are just drawing the entire screen over and over.
   */
  function render() {
    /* This array holds the relative URL to the image used
     * for that particular row of the game level.
     */
    var rowImages = [
        'images/water-block.png', // Top row is water
        'images/stone-block.png', // Row 1 of 3 of stone
        'images/stone-block.png', // Row 2 of 3 of stone
        'images/stone-block.png', // Row 3 of 3 of stone
        'images/grass-block.png', // Row 1 of 2 of grass
        'images/grass-block.png' // Row 2 of 2 of grass
      ],
      numRows = 6,
      numCols = 5,
      row, col;

    // Before drawing, clear existing canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        /* The drawImage function of the canvas' context element
         * requires 3 parameters: the image to draw, the x coordinate
         * to start drawing and the y coordinate to start drawing.
         * We're using our Resources helpers to refer to our images
         * so that we get the benefits of caching these images, since
         * we're using them over and over.
         */
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
      }
    }

    renderEntities();
  }

  /*
   * @description This function is called by the render function and is called on each game
   * tick. Its purpose is to then call the render functions you have defined
   * on your enemy and player entities within app.js
   */
  function renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
     * the render function you have defined.
     */
    allEnemies.forEach(function(enemy) {
      enemy.render();
    });

    player.render();
  }

  /* @description Handle game reset state.
   * It's called once by the init() method and in main(), when isGameOver becomes true.
   * Implements different behaviors depending on the reason why game is over.
   */
  function reset() {

    switch (whyGameIsOver) {

      // When game starts.
      case "Start":

        // This blocks the player from moving and handles the appearance of welcome screen.
        isGameOver = true;

        // Display welcome message
        displayBegin();

        break;

        // When player reaches the win position.
      case "Success":

        // Display success screen.
        displayWin();

        break;

        // When collison happens.
      case "Collision":

        // Show a red screen over the canvas to make collison more stressful.
        // It also resets to the default isGameOver notifier.
        showRedScreen();

        // Reset the position of the player.
        player.resetPosition();

        break;
    }
  }

  // Counter of frames after which the red screen of collision should disappear.
  let backToGameCounter = 10;

  /*
   * @description Displays red screen when collision is detected;
   */
  function showRedScreen() {

    /*
     * This is the red screen rectangle with a little opacity.
     * It will appear over the canvas.
     */
    ctx.fillStyle = "rgba(255, 0, 0, 0.6)";
    ctx.fillRect(0, 50, canvas.width, canvas.height - 70);

    // Decrement backToGameCounter by 1.
    backToGameCounter -= 1;

    /*
     * When backToGameCounter reaches 0,
     * Reset the state isGameOver notifier, which will remove the red screen, too.
     * Reset the counter which is used to determine when to remove red screen.
     */
    if (backToGameCounter == 0) {

      isGameOver = false;

      backToGameCounter = 10;
    }
  }

  // Counter of frames after which the begin screen should disappear.
  let beginGameCounter = 100;

  // @description Displays begin screen.
  function displayBegin() {

    // Display background with opacity to make begin text more highlighted.
    ctx.fillStyle = "rgba(23, 23, 23, 0.5)";
    ctx.fillRect(0, 50, canvas.width, canvas.height - 70);

    // 'Get Ready!' text styling and declaring.
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px Impact";
    ctx.textAlign = "center";
    ctx.fillText('Get Ready!', canvas.width / 2, canvas.height / 2);

    ctx.strokeStyle = "#202020";
    ctx.font = "bold 36px Impact";
    ctx.textAlign = "center";
    ctx.strokeText('Get Ready!', canvas.width / 2, canvas.height / 2);

    // Decrement beginGameCounter by 1.
    beginGameCounter -= 1;

    /*
     * When beginGameCounter reaches 0,
     * Reset the state isGameOver notifier, which will remove the welcome screen, too.
     * Reset the begin counter which will be used again when player wins the game.
     */
    if (beginGameCounter == 0) {

      isGameOver = false;

      beginGameCounter = 100;
    }
  }

  // Counter of frames after which the win screen should disappear and game will be restarted.
  let restartGameCounter = 200;

  /*
   * @description Displays win screen.
   */
  function displayWin() {

    // Display background with opacity to make begin text more highlighted.
    ctx.fillStyle = "rgba(79, 189, 84, 0.5)";
    ctx.fillRect(0, 30, canvas.width, canvas.height - 50);

    // 'You Win!' text styling and declaring.
    ctx.fillStyle = "#ffffff";
    ctx.font = "normal 46px Impact";
    ctx.textAlign = "center";
    ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2);

    ctx.strokeStyle = "#202020";
    ctx.font = "normal 46px Impact";
    ctx.textAlign = "center";
    ctx.strokeText('You Win!', canvas.width / 2, canvas.height / 2);

    // Decrement restartGameCounter by 1.
    restartGameCounter -= 1;

    /*
     * When counter reaches 0,
     * Reset the position of the player.
     * Reset the restartGameCounter, which will be used again when player wins the game.
     * Do not change isGameOver notifier, just change the reason whyGameIsOver,
     * this will run "Start" case in reset() on next frame flick, which will draw the begin screen
     * and reset the state of isGameOver.
     */
    if (restartGameCounter == 0) {
      // Reset the position of the player.
      player.resetPosition();

      restartGameCounter = 200;

      whyGameIsOver = "Start";
    }
  }

  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
   */
  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/enemy-bug.png',
    'images/char-boy.png'
  ]);
  Resources.onReady(init);

  /* Assign the canvas' context object and canvas object to the global variables (the window
   * object when run in a browser) so that developers can use it more easily
   * from within their app.js files.
   */
  global.ctx = ctx;
  global.canvas = canvas;
  // Global variable to check if game is over
  global.isGameOver = false;
  // Global variable which holds the reason for Game Over.
  // It will be used to determine what screen should appear in reset() method above.
  // It has 3 possible options:
  // "Start"- The game is about to start, this is the default value;
  // "Collision" - The player has collided with an enemy;
  // "Success" - The player has reached successfully the end point;
  global.whyGameIsOver = "Start";
})(this);
