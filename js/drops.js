export class Drop {
    constructor(x, y, size, speedMultiplier, velocityX = 0) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.radius = this.getRadius();
        this.speedY = this.getBaseSpeed() * speedMultiplier;
        this.velocityX = velocityX;
        this.isBomb = size === 'large';
        this.active = true;
        this.wobble = 0;
        this.wobbleSpeed = 3 + Math.random() * 2;
        
        this.image = new Image();
        if (size === 'medium') {
            this.image.src = 'assets/drop 2.png';
        } else {
            this.image.src = 'assets/drop 1.png';
        }
    }

    getRadius() {
        switch (this.size) {
            case 'small': return 10;
            case 'medium': return 14;
            default: return 10;
        }
    }

    getBaseSpeed() {
        switch (this.size) {
            case 'small': return 220;
            case 'medium': return 240;
            default: return 220;
        }
    }

    update(deltaTime) {
        this.x += this.velocityX * deltaTime;
        this.y += this.speedY * deltaTime;
        this.wobble += deltaTime * this.wobbleSpeed;
    }

    render(ctx) {
        const wobbleX = Math.sin(this.wobble) * 2;
        const cx = this.x + wobbleX;
        const cy = this.y;

        ctx.save();

        if (this.image && this.image.complete) {
            // Draw image scaled to fit roughly the original drop dimensions
            ctx.drawImage(this.image, cx - this.radius * 1.5, cy - this.radius * 1.5, this.radius * 3, this.radius * 3);
        }

        ctx.restore();
    }

    isOffScreen(canvasHeight) {
        return this.y - this.radius > canvasHeight;
    }

    getPosition() {
        // Match the visual wobble offset used in render
        return { x: this.x + Math.sin(this.wobble) * 2, y: this.y };
    }
}

export class DropManager {
    constructor() {
        this.drops = [];
    }

    addDrop(drop) { this.drops.push(drop); }

    update(deltaTime, canvasHeight) {
        for (let drop of this.drops) {
            drop.update(deltaTime);
        }

        // Separate missed drops (off-screen) from active ones
        const missed = this.drops.filter(drop => drop.isOffScreen(canvasHeight));
        this.drops = this.drops.filter(drop => !drop.isOffScreen(canvasHeight));

        // Return missed drops so the caller can score them
        return missed;
    }

    render(ctx) {
        for (let drop of this.drops) {
            drop.render(ctx);
        }
    }

    getDrops() { return this.drops; }

    clear() { this.drops = []; }
}
