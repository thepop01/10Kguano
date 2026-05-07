export class InputHandler {
    constructor() {
        this.keys = {};
        this.touchLeft = false;
        this.touchRight = false;
        this.restartPressed = false;

        this.setupKeyboardListeners();
        this.setupTouchListeners();
    }

    setupKeyboardListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === 'r' || e.key === 'R') {
                this.restartPressed = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
            if (e.key === 'r' || e.key === 'R') {
                this.restartPressed = false;
            }
        });
    }

    setupTouchListeners() {
        // Touch controls removed
    }

    isMovingLeft() {
        return this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A'] || this.touchLeft;
    }

    isMovingRight() {
        return this.keys['ArrowRight'] || this.keys['d'] || this.keys['D'] || this.touchRight;
    }

    isJumping() {
        return this.keys['ArrowUp'] || this.keys['w'] || this.keys['W'] || this.keys[' '] || this.touchJump;
    }

    isRestartRequested() {
        return this.restartPressed;
    }

    clearRestart() {
        this.restartPressed = false;
    }
}