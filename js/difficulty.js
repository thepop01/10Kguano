export class DifficultyManager {
    constructor() {
        this.score = 0;
        this.dropFrequencyMultiplier = 1.0;
        this.speedMultiplier = 1.0;
        this.mediumDropProbability = 0.2;
        this.birdCount = 1;
    }

    update(dropsDodged) {
        this.score = dropsDodged;
        this.updateDifficulty();
    }

    updateDifficulty() {
        // Progressive difficulty scaling (10x faster rate, but over 10,000 drops)
        if (this.score < 2000) {
            // Early game: increase every 10 drops
            this.updateEarlyGame();
        } else if (this.score < 5000) {
            // Mid game: increase every 20 drops
            this.updateMidGame();
        } else {
            // Late game: increase every 50 drops
            this.updateLateGame();
        }

        // Bird progression
        this.updateBirdCount();
    }

    updateEarlyGame() {
        const tier = Math.floor(this.score / 10);
        this.dropFrequencyMultiplier = 1.0 + tier * 0.05;
        this.speedMultiplier = 1.0 + tier * 0.03;
        this.mediumDropProbability = Math.min(0.2 + tier * 0.02, 0.4);
    }

    updateMidGame() {
        const baseTier = 200; // 2000 / 10
        const additionalTier = Math.floor((this.score - 2000) / 20);
        const totalTier = baseTier + additionalTier;

        this.dropFrequencyMultiplier = 1.0 + totalTier * 0.05;
        this.speedMultiplier = 1.0 + totalTier * 0.03;
        this.mediumDropProbability = Math.min(0.2 + totalTier * 0.02, 0.5);
    }

    updateLateGame() {
        const baseTier = 350; // 2000/10 + 3000/20
        const additionalTier = Math.floor((this.score - 5000) / 50);
        const totalTier = baseTier + additionalTier;

        this.dropFrequencyMultiplier = 1.0 + totalTier * 0.05;
        this.speedMultiplier = 1.0 + totalTier * 0.03;
        this.mediumDropProbability = Math.min(0.2 + totalTier * 0.02, 0.6);
    }

    updateBirdCount() {
        if (this.score >= 1000) {
            this.birdCount = 3;
        } else if (this.score >= 200) {
            this.birdCount = 2;
        } else {
            this.birdCount = 1;
        }
    }

    getDropFrequencyMultiplier() {
        return this.dropFrequencyMultiplier;
    }

    getSpeedMultiplier() {
        return this.speedMultiplier;
    }

    getRandomDropSize() {
        const rand = Math.random();
        if (rand < this.mediumDropProbability) {
            return 'medium';
        } else {
            return 'small';
        }
    }

    getBirdCount() {
        return this.birdCount;
    }

    reset() {
        this.score = 0;
        this.dropFrequencyMultiplier = 1.0;
        this.speedMultiplier = 1.0;
        this.mediumDropProbability = 0.2;
        this.birdCount = 1;
    }
}
