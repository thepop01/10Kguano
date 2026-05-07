export class UIManager {
    constructor() {
        this.scoreDisplay = document.getElementById('score-display');
        this.healthDisplay = document.getElementById('health-display');
        this.messageOverlay = document.getElementById('message-overlay');
        this.messageText = document.getElementById('message-text');
        this.messageSubtext = document.getElementById('message-subtext');
        this.restartHint = document.getElementById('restart-hint');
    }

    updateScore(score) {
        this.scoreDisplay.textContent = `Score: ${score}`;
    }

    updateHealth(health) {
        const hearts = '❤️'.repeat(health);
        this.healthDisplay.textContent = `Health: ${hearts}`;
    }

    showGameOver(finalScore) {
        this.messageText.textContent = 'Game Over';
        this.messageSubtext.textContent = `Final Score: ${finalScore}`;
        this.messageOverlay.classList.remove('hidden');
    }

    showWin(finalScore) {
        this.messageText.textContent = 'You Win!';
        this.messageSubtext.textContent = `Final Score: ${finalScore}`;
        this.messageOverlay.classList.remove('hidden');
    }

    showStartScreen() {
        this.messageText.textContent = '10kGuano';
        this.messageSubtext.textContent = 'Use arrow keys or A/D to move. Avoid the falling drops.';
        this.restartHint.textContent = 'Press Enter or click to start';
        this.messageOverlay.classList.remove('hidden');
    }

    hideMessage() {
        this.messageOverlay.classList.add('hidden');
    }

    reset() {
        this.updateScore(0);
        this.updateHealth(3);
        this.hideMessage();
    }
}
