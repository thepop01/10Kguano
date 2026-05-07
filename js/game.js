import { InputHandler } from './input.js?v=9';
import { Player } from './player.js?v=9';
import { BirdManager, Bird } from './bird.js?v=9';
import { DropManager } from './drops.js?v=9';
import { SplashManager } from './splashes.js?v=9';
import { CollisionManager } from './collision.js?v=9';
import { DifficultyManager } from './difficulty.js?v=9';
import { UIManager } from './ui.js?v=9';
import { Leaderboard } from './leaderboard.js?v=1';

const GAME_STATE = {
    MENU: 'menu',
    PLAYING: 'playing',
    GAMEOVER: 'gameover',
    WIN: 'win'
};

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = GAME_STATE.MENU;
        this.playerName = "Player"; // Default name

        this.setupCanvas();
        this.setupComponents();
        this.setupEventListeners();

        // Fetch leaderboard scores immediately
        Leaderboard.fetchAndRenderScores();

        this.lastTime = 0;
        this.gameLoop = this.gameLoop.bind(this);
        this.uiManager.showStartScreen();
        requestAnimationFrame(this.gameLoop);
    }

    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;

        // Reset star cache on resize so they reposition within new bounds
        this._stars = null;

        if (this.player) {
            this.player.resize(this.canvas.width, this.canvas.height);
        }
        if (this.birdManager) {
            this.birdManager.resize(this.canvas.width, this.canvas.height);
        }
    }

    setupComponents() {
        this.inputHandler = new InputHandler();
        this.player = new Player(this.canvas.width, this.canvas.height);
        this.birdManager = new BirdManager();
        this.dropManager = new DropManager();
        this.splashManager = new SplashManager();
        this.difficultyManager = new DifficultyManager();
        this.uiManager = new UIManager();

        this.bgImage = new Image();
        this.bgImage.src = 'assets/background.png';

        this.score = 0;
        this.health = 3;
    }

    setupEventListeners() {
        const landingPage = document.getElementById('landing-page');
        const gameContainer = document.getElementById('game-container');
        const startBtn = document.getElementById('start-game-btn');
        const nameInput = document.getElementById('player-name-input');

        const initiateGame = () => {
            const enteredName = nameInput.value.trim();
            if (enteredName) {
                this.playerName = enteredName;
            }
            
            // Hide landing page, show game
            landingPage.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            
            // Force a canvas resize now that the container is visible
            this.resizeCanvas();
            
            this.startGame();
        };

        // Start from landing page
        startBtn.addEventListener('click', initiateGame);
        
        nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                initiateGame();
            }
        });

        // Restart logic from game over/win screens
        const restartGame = () => {
            if (this.state === GAME_STATE.GAMEOVER || this.state === GAME_STATE.WIN) {
                // If they restart, fetch latest scores for next time they go to the menu
                Leaderboard.fetchAndRenderScores();
                this.restart();
            }
        };

        window.addEventListener('click', restartGame);
        window.addEventListener('touchstart', restartGame, { passive: false });

        window.addEventListener('keydown', (e) => {
            if ((this.state === GAME_STATE.GAMEOVER || this.state === GAME_STATE.WIN) && (e.key === 'Enter' || e.key === 'r' || e.key === 'R')) {
                e.preventDefault();
                this.restart();
            }
        });
    }

    startGame() {
        this.state = GAME_STATE.PLAYING;
        this.score = 0;
        this.health = 3;
        Bird.isAnyBirdHovering = false;
        this.difficultyManager.reset();
        this.dropManager.clear();
        this.splashManager.clear();
        this.birdManager.clear();
        this.uiManager.reset();
        
        // Hide the start screen message if it's there
        const messageOverlay = document.getElementById('message-overlay');
        if (messageOverlay) {
            messageOverlay.classList.add('hidden');
        }

        this.spawnInitialBirds();
    }

    spawnInitialBirds() {
        const birdCount = this.difficultyManager.getBirdCount();
        for (let i = 0; i < birdCount; i++) {
            const bird = new Bird(this.canvas.width, this.canvas.height, i);
            this.birdManager.addBird(bird);
        }
    }

    updateBirdCount() {
        const currentBirdCount = this.birdManager.birds.length;
        const targetBirdCount = this.difficultyManager.getBirdCount();

        if (targetBirdCount > currentBirdCount) {
            for (let i = currentBirdCount; i < targetBirdCount; i++) {
                const bird = new Bird(this.canvas.width, this.canvas.height, i);
                this.birdManager.addBird(bird);
            }
        }
    }

    gameLoop(currentTime) {
        let deltaTime = (currentTime - this.lastTime) / 1000;
        if (deltaTime > 0.1) {
            deltaTime = 0.1; // Prevent large time steps
        }
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.gameLoop);
    }

    update(deltaTime) {
        if (this.state === GAME_STATE.MENU) {
            return;
        }

        if (this.state === GAME_STATE.PLAYING) {
            this.updateGameplay(deltaTime);
        }

        if (this.state === GAME_STATE.GAMEOVER || this.state === GAME_STATE.WIN) {
            this.checkRestart();
        }
    }

    updateGameplay(deltaTime) {
        // Update player
        this.player.update(deltaTime, this.inputHandler);

        // Update birds
        this.birdManager.update(deltaTime, this.dropManager, this.difficultyManager, this.player);

        // Update drops — capture any that hit the ground before they're removed
        const missedDrops = this.dropManager.update(deltaTime, this.canvas.height);
        for (let drop of missedDrops) {
            this.handleDropGroundCollision(drop);
        }

        // Update splashes
        this.splashManager.update(deltaTime);

        // Update difficulty
        this.difficultyManager.update(this.score);

        // Update bird count
        this.updateBirdCount();

        // Check collisions
        this.checkCollisions();

        // Update UI
        this.uiManager.updateScore(this.score);
        this.uiManager.updateHealth(this.health);

        // Check win condition
        if (this.score >= 10000) {
            this.state = GAME_STATE.WIN;
            this.uiManager.showWin(this.score);
        }
    }

    checkCollisions() {
        if (this.player.isShielded()) return;

        const drops = this.dropManager.getDrops();

        for (let i = 0; i < drops.length; i++) {
            const drop = drops[i];

            // Check torso hit first — this deals damage
            if (CollisionManager.checkPlayerTorsoCollision(this.player, drop)) {
                this.health--;
                this.player.startShield(2);
                this.dropManager.drops.splice(i, 1);

                if (this.health <= 0) {
                    this.state = GAME_STATE.GAMEOVER;
                    this.uiManager.showGameOver(this.score);
                    Leaderboard.submitScore(this.playerName, this.score);
                }
                return;
            }

            // Leg hit — absorb silently, no damage
            if (CollisionManager.checkPlayerLegCollision(this.player, drop)) {
                this.dropManager.drops.splice(i, 1);
                return;
            }
        }
    }

    handleDropGroundCollision(drop) {
        // Create splash
        const dropPosition = drop.getPosition();
        this.splashManager.addSplash(dropPosition.x, this.canvas.height, drop.radius);

        // Increment score
        this.score++;
    }

    checkRestart() {
        if (this.inputHandler.isRestartRequested()) {
            this.inputHandler.clearRestart();
            this.restart();
        }
    }

    restart() {
        this.startGame();
    }

    render() {
        const ctx = this.ctx;
        const W = this.canvas.width;
        const H = this.canvas.height;

        if (this.bgImage && this.bgImage.complete) {
            ctx.drawImage(this.bgImage, 0, 0, W, H);
        } else {
            ctx.fillStyle = '#16213e';
            ctx.fillRect(0, 0, W, H);
        }

        if (this.state === GAME_STATE.PLAYING) {
            this.splashManager.render(ctx);
            this.dropManager.render(ctx);
            this.birdManager.render(ctx);
            this.player.render(ctx);
        }
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
});
