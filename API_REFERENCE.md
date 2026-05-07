# Bird Drop Dodge - API Reference

## Game Engine API

### Game Class
**Location**: `js/game.js`

#### Constructor
```javascript
new Game()
```
Creates a new game instance and initializes all systems.

#### Methods

##### `setupCanvas()`
Sets up the canvas and resize event listener.
- **Returns**: `void`

##### `resizeCanvas()`
Resizes the canvas to fill the window and updates component positions.
- **Returns**: `void`

##### `setupComponents()`
Initializes all game systems (player, birds, drops, splashes, collision, difficulty, UI).
- **Returns**: `void`

##### `setupEventListeners()`
Sets up click event listener for restart functionality.
- **Returns**: `void`

##### `startGame()`
Initializes game state and spawns initial birds.
- **Returns**: `void`

##### `spawnInitialBirds()`
Creates birds based on current difficulty level.
- **Returns**: `void`

##### `updateBirdCount()`
Updates the number of birds based on difficulty progression.
- **Returns**: `void`

##### `gameLoop(currentTime)`
Main game loop called by requestAnimationFrame.
- **Parameters**: 
  - `currentTime` (number): Current timestamp in milliseconds
- **Returns**: `void`

##### `update(deltaTime)`
Updates all game systems based on current state.
- **Parameters**:
  - `deltaTime` (number): Time elapsed since last frame in seconds
- **Returns**: `void`

##### `updateGameplay(deltaTime)`
Updates all gameplay systems during PLAYING state.
- **Parameters**:
  - `deltaTime` (number): Time elapsed since last frame in seconds
- **Returns**: `void`

##### `checkCollisions()`
Checks all collision types and handles game state changes.
- **Returns**: `void`

##### `handleDropGroundCollision(drop)`
Handles when a drop hits the ground.
- **Parameters**:
  - `drop` (Drop): The drop that hit the ground
- **Returns**: `void`

##### `checkRestart()`
Checks if restart was requested and restarts game.
- **Returns**: `void`

##### `restart()`
Restarts the game.
- **Returns**: `void`

##### `render()`
Renders all game objects to the canvas.
- **Returns**: `void`

## Player API

### Player Class
**Location**: `js/player.js`

#### Constructor
```javascript
new Player(canvasWidth, canvasHeight)
```
Creates a new player instance.
- **Parameters**:
  - `canvasWidth` (number): Width of the canvas
  - `canvasHeight` (number): Height of the canvas

#### Properties
- `width` (number): Player width (40px)
- `height` (number): Player height (60px)
- `x` (number): Player X position
- `y` (number): Player Y position
- `speed` (number): Maximum speed (300px/s)
- `velocityX` (number): Current horizontal velocity
- `acceleration` (number): Acceleration rate (1500px/s²)
- `friction` (number): Friction factor (0.85)

#### Methods

##### `update(deltaTime, inputHandler)`
Updates player position based on input and physics.
- **Parameters**:
  - `deltaTime` (number): Time elapsed since last frame in seconds
  - `inputHandler` (InputHandler): Input handler instance
- **Returns**: `void`

##### `render(ctx)`
Draws the player to the canvas.
- **Parameters**:
  - `ctx` (CanvasRenderingContext2D): Canvas 2D context
- **Returns**: `void`

##### `getBounds()`
Gets the player's collision rectangle.
- **Returns**: Object with `x`, `y`, `width`, `height` properties

##### `resize(canvasWidth, canvasHeight)`
Updates player position when canvas is resized.
- **Parameters**:
  - `canvasWidth` (number): New canvas width
  - `canvasHeight` (number): New canvas height
- **Returns**: `void`

## Bird API

### Bird Class
**Location**: `js/bird.js`

#### Constructor
```javascript
new Bird(canvasWidth, canvasHeight, birdId)
```
Creates a new bird instance.
- **Parameters**:
  - `canvasWidth` (number): Width of the canvas
  - `canvasHeight` (number): Height of the canvas
  - `birdId` (number): Unique identifier for the bird

#### Properties
- `width` (number): Bird width (50px)
- `height` (number): Bird height (30px)
- `x` (number): Bird X position
- `y` (number): Bird Y position
- `speed` (number): Movement speed (100-150px/s)
- `direction` (number): Movement direction (1 or -1)
- `dropTimer` (number): Time since last drop
- `dropInterval` (number): Time between drops (0.5-1.0s)

#### Methods

##### `update(deltaTime, dropManager, difficultyManager)`
Updates bird movement and drop spawning.
- **Parameters**:
  - `deltaTime` (number): Time elapsed since last frame in seconds
  - `dropManager` (DropManager): Drop manager instance
  - `difficultyManager` (DifficultyManager): Difficulty manager instance
- **Returns**: `void`

##### `drop(dropManager, difficultyManager)`
Creates a new drop object.
- **Parameters**:
  - `dropManager` (DropManager): Drop manager instance
  - `difficultyManager` (DifficultyManager): Difficulty manager instance
- **Returns**: `void`

##### `render(ctx)`
Draws the bird to the canvas.
- **Parameters**:
  - `ctx` (CanvasRenderingContext2D): Canvas 2D context
- **Returns**: `void`

##### `resize(canvasWidth, canvasHeight)`
Updates bird position when canvas is resized.
- **Parameters**:
  - `canvasWidth` (number): New canvas width
  - `canvasHeight` (number): New canvas height
- **Returns**: `void`

### BirdManager Class

#### Constructor
```javascript
new BirdManager()
```
Creates a new bird manager instance.

#### Methods

##### `addBird(bird)`
Adds a bird to the collection.
- **Parameters**:
  - `bird` (Bird): Bird instance to add
- **Returns**: `void`

##### `update(deltaTime, dropManager, difficultyManager)`
Updates all birds in the collection.
- **Parameters**:
  - `deltaTime` (number): Time elapsed since last frame in seconds
  - `dropManager` (DropManager): Drop manager instance
  - `difficultyManager` (DifficultyManager): Difficulty manager instance
- **Returns**: `void`

##### `render(ctx)`
Renders all birds to the canvas.
- **Parameters**:
  - `ctx` (CanvasRenderingContext2D): Canvas 2D context
- **Returns**: `void`

##### `resize(canvasWidth, canvasHeight)`
Updates all birds when canvas is resized.
- **Parameters**:
  - `canvasWidth` (number): New canvas width
  - `canvasHeight` (number): New canvas height
- **Returns**: `void`

##### `clear()`
Removes all birds from the collection.
- **Returns**: `void`

## Drop API

### Drop Class
**Location**: `js/drops.js`

#### Constructor
```javascript
new Drop(x, y, size, speedMultiplier)
```
Creates a new drop instance.
- **Parameters**:
  - `x` (number): Drop X position
  - `y` (number): Drop Y position
  - `size` (string): Drop size ('small', 'medium', 'large')
  - `speedMultiplier` (number): Speed multiplier from difficulty

#### Properties
- `x` (number): Drop X position
- `y` (number): Drop Y position
- `size` (string): Drop size
- `radius` (number): Drop radius (15/25/35px)
- `speed` (number): Fall speed (200/250/300px/s × multiplier)
- `isBomb` (boolean): Whether drop is a bomb (large drops)

#### Methods

##### `update(deltaTime)`
Updates drop position.
- **Parameters**:
  - `deltaTime` (number): Time elapsed since last frame in seconds
- **Returns**: `void`

##### `render(ctx)`
Draws the drop to the canvas.
- **Parameters**:
  - `ctx` (CanvasRenderingContext2D): Canvas 2D context
- **Returns**: `void`

##### `isOffScreen(canvasHeight)`
Checks if drop is below the screen.
- **Parameters**:
  - `canvasHeight` (number): Height of the canvas
- **Returns**: `boolean`

##### `getPosition()`
Gets the drop's current position.
- **Returns**: Object with `x` and `y` properties

### DropManager Class

#### Constructor
```javascript
new DropManager()
```
Creates a new drop manager instance.

#### Methods

##### `addDrop(drop)`
Adds a drop to the collection.
- **Parameters**:
  - `drop` (Drop): Drop instance to add
- **Returns**: `void`

##### `update(deltaTime, canvasHeight)`
Updates all drops and removes off-screen ones.
- **Parameters**:
  - `deltaTime` (number): Time elapsed since last frame in seconds
  - `canvasHeight` (number): Height of the canvas
- **Returns**: `void`

##### `render(ctx)`
Renders all drops to the canvas.
- **Parameters**:
  - `ctx` (CanvasRenderingContext2D): Canvas 2D context
- **Returns**: `void`

##### `getDrops()`
Gets all drops in the collection.
- **Returns**: Array of Drop instances

##### `clear()`
Removes all drops from the collection.
- **Returns**: `void`

## Splash API

### Splash Class
**Location**: `js/splashes.js`

#### Constructor
```javascript
new Splash(x, y, radius)
```
Creates a new splash instance.
- **Parameters**:
  - `x` (number): Splash X position
  - `y` (number): Splash Y position
  - `radius` (number): Initial radius

#### Properties
- `x` (number): Splash X position
- `y` (number): Splash Y position
- `maxRadius` (number): Maximum radius (radius × 2)
- `currentRadius` (number): Current radius
- `lifetime` (number): Splash lifetime (1.5s)
- `age` (number): Current age
- `active` (boolean): Whether splash is still active

#### Methods

##### `update(deltaTime)`
Updates splash expansion and fading.
- **Parameters**:
  - `deltaTime` (number): Time elapsed since last frame in seconds
- **Returns**: `void`

##### `render(ctx)`
Draws the splash to the canvas.
- **Parameters**:
  - `ctx` (CanvasRenderingContext2D): Canvas 2D context
- **Returns**: `void`

##### `isPlayerInside(playerBounds)`
Checks if player is inside splash zone.
- **Parameters**:
  - `playerBounds` (object): Player collision rectangle
- **Returns**: `boolean`

##### `isActive()`
Checks if splash is still active.
- **Returns**: `boolean`

### SplashManager Class

#### Constructor
```javascript
new SplashManager()
```
Creates a new splash manager instance.

#### Methods

##### `addSplash(x, y, radius)`
Adds a splash to the collection.
- **Parameters**:
  - `x` (number): Splash X position
  - `y` (number): Splash Y position
  - `radius` (number): Splash radius
- **Returns**: `void`

##### `update(deltaTime)`
Updates all splashes and removes inactive ones.
- **Parameters**:
  - `deltaTime` (number): Time elapsed since last frame in seconds
- **Returns**: `void`

##### `render(ctx)`
Renders all splashes to the canvas.
- **Parameters**:
  - `ctx` (CanvasRenderingContext2D): Canvas 2D context
- **Returns**: `void`

##### `checkPlayerCollision(playerBounds)`
Checks if player is inside any splash zone.
- **Parameters**:
  - `playerBounds` (object): Player collision rectangle
- **Returns**: `boolean`

##### `clear()`
Removes all splashes from the collection.
- **Returns**: `void`

## Collision API

### CollisionManager Class
**Location**: `js/collision.js`

#### Static Methods

##### `checkRectangleCircle(rect, circle)`
Checks collision between a rectangle and a circle.
- **Parameters**:
  - `rect` (object): Rectangle with `x`, `y`, `width`, `height`
  - `circle` (object): Circle with `x`, `y`, `radius`
- **Returns**: `boolean`

##### `checkPlayerDropCollision(player, drop)`
Checks collision between player and drop.
- **Parameters**:
  - `player` (Player): Player instance
  - `drop` (Drop): Drop instance
- **Returns**: `boolean`

##### `checkPlayerSplashCollision(player, splashManager)`
Checks collision between player and any splash.
- **Parameters**:
  - `player` (Player): Player instance
  - `splashManager` (SplashManager): Splash manager instance
- **Returns**: `boolean`

## Difficulty API

### DifficultyManager Class
**Location**: `js/difficulty.js`

#### Constructor
```javascript
new DifficultyManager()
```
Creates a new difficulty manager instance.

#### Properties
- `score` (number): Current score
- `dropFrequencyMultiplier` (number): Drop frequency multiplier
- `speedMultiplier` (number): Drop speed multiplier
- `largeDropProbability` (number): Probability of large drops (0.0-1.0)
- `birdCount` (number): Number of birds (1-5)

#### Methods

##### `update(dropsDodged)`
Updates difficulty based on current score.
- **Parameters**:
  - `dropsDodged` (number): Number of drops dodged
- **Returns**: `void`

##### `updateDifficulty()`
Updates all difficulty parameters based on game phase.
- **Returns**: `void`

##### `updateEarlyGame()`
Updates difficulty for early game (0-2000 points).
- **Returns**: `void`

##### `updateMidGame()`
Updates difficulty for mid game (2000-5000 points).
- **Returns**: `void`

##### `updateLateGame()`
Updates difficulty for late game (5000+ points).
- **Returns**: `void`

##### `updateBirdCount()`
Updates number of birds based on score thresholds.
- **Returns**: `void`

##### `getDropFrequencyMultiplier()`
Gets current drop frequency multiplier.
- **Returns**: `number`

##### `getSpeedMultiplier()`
Gets current speed multiplier.
- **Returns**: `number`

##### `getRandomDropSize()`
Gets a random drop size based on current probabilities.
- **Returns**: `string` ('small', 'medium', or 'large')

##### `getBirdCount()`
Gets current number of birds.
- **Returns**: `number`

##### `reset()`
Resets all difficulty parameters to initial values.
- **Returns**: `void`

## UI API

### UIManager Class
**Location**: `js/ui.js`

#### Constructor
```javascript
new UIManager()
```
Creates a new UI manager instance.

#### Methods

##### `updateScore(score)`
Updates the score display.
- **Parameters**:
  - `score` (number): Current score
- **Returns**: `void`

##### `updateHealth(health)`
Updates the health display with hearts.
- **Parameters**:
  - `health` (number): Current health (0-3)
- **Returns**: `void`

##### `showGameOver(finalScore)`
Displays the game over screen.
- **Parameters**:
  - `finalScore` (number): Final score
- **Returns**: `void`

##### `showWin(finalScore)`
Displays the win screen.
- **Parameters**:
  - `finalScore` (number): Final score
- **Returns**: `void`

##### `hideMessage()`
Hides the message overlay.
- **Returns**: `void`

##### `reset()`
Resets all UI elements to initial state.
- **Returns**: `void`

## Input API

### InputHandler Class
**Location**: `js/input.js`

#### Constructor
```javascript
new InputHandler()
```
Creates a new input handler instance.

#### Properties
- `keys` (object): Key state mapping
- `touchLeft` (boolean): Left touch input state
- `touchRight` (boolean): Right touch input state
- `restartPressed` (boolean): Restart input state

#### Methods

##### `setupKeyboardListeners()`
Sets up keyboard event listeners.
- **Returns**: `void`

##### `setupTouchListeners()`
Sets up touch event listeners.
- **Returns**: `void`

##### `handleTouch(touches)`
Processes touch input.
- **Parameters**:
  - `touches` (TouchList): List of touch points
- **Returns**: `void`

##### `isMovingLeft()`
Checks if left movement input is active.
- **Returns**: `boolean`

##### `isMovingRight()`
Checks if right movement input is active.
- **Returns**: `boolean`

##### `isRestartRequested()`
Checks if restart input is active.
- **Returns**: `boolean`

##### `clearRestart()`
Clears the restart input flag.
- **Returns**: `void`

## Constants

### Game States
```javascript
const GAME_STATE = {
    MENU: 'menu',
    PLAYING: 'playing',
    GAMEOVER: 'gameover',
    WIN: 'win'
};
```

### Drop Sizes
```javascript
const DROP_SIZES = {
    SMALL: 'small',    // 15px radius, 200px/s
    MEDIUM: 'medium',  // 25px radius, 250px/s
    LARGE: 'large'     // 35px radius, 300px/s
};
```

### Difficulty Thresholds
```javascript
const DIFFICULTY_THRESHOLDS = {
    EARLY_GAME_END: 2000,
    MID_GAME_END: 5000,
    BIRD_2: 2000,
    BIRD_3: 4000,
    BIRD_4: 6000,
    BIRD_5: 8000
};
```

### Game Constants
```javascript
const GAME_CONSTANTS = {
    WIN_SCORE: 10000,
    INITIAL_HEALTH: 3,
    SPLASH_DAMAGE_COOLDOWN: 0.5,
    MAX_DELTA_TIME: 0.1,
    SPLASH_LIFETIME: 1.5
};
```

## Event System

### Canvas Events
- **resize**: Window resize event
- **click**: Canvas click event (for restart)

### Keyboard Events
- **keydown**: Key press events
- **keyup**: Key release events

### Touch Events
- **touchstart**: Touch start events
- **touchmove**: Touch move events
- **touchend**: Touch end events

## Utility Functions

### Distance Calculation
```javascript
function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
```

### Rectangle-Circle Collision
```javascript
function checkRectangleCircleCollision(rect, circle) {
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;
    return (distanceX * distanceX + distanceY * distanceY) < (circle.radius * circle.radius);
}
```

This API reference provides complete documentation for all public interfaces in the Bird Drop Dodge game. Use this as a guide for extending or modifying the game's functionality.