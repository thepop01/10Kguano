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
        // Only show and wire touch buttons on actual touch devices
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        const controls = document.getElementById('touch-controls');
        if (!isTouchDevice || !controls) return;

        controls.classList.add('visible');

        const btnLeft  = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnJump  = document.getElementById('btn-jump');

        const press   = (flag) => (e) => { e.preventDefault(); this[flag] = true;  };
        const release = (flag) => (e) => { e.preventDefault(); this[flag] = false; };

        btnLeft.addEventListener('touchstart',  press('touchLeft'),   { passive: false });
        btnLeft.addEventListener('touchend',    release('touchLeft'), { passive: false });
        btnLeft.addEventListener('touchcancel', release('touchLeft'), { passive: false });

        btnRight.addEventListener('touchstart',  press('touchRight'),   { passive: false });
        btnRight.addEventListener('touchend',    release('touchRight'), { passive: false });
        btnRight.addEventListener('touchcancel', release('touchRight'), { passive: false });

        btnJump.addEventListener('touchstart',  press('touchJump'),   { passive: false });
        btnJump.addEventListener('touchend',    release('touchJump'), { passive: false });
        btnJump.addEventListener('touchcancel', release('touchJump'), { passive: false });
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