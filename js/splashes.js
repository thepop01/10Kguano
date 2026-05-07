export class Splash {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.maxRadius = radius * 2;
        this.currentRadius = 0;
        this.lifetime = 1.5;
        this.age = 0;
        this.active = true;
    }

    update(deltaTime) {
        this.age += deltaTime;

        // Expand radius
        if (this.currentRadius < this.maxRadius) {
            this.currentRadius += this.maxRadius * 2 * deltaTime;
        }

        // Check lifetime
        if (this.age >= this.lifetime) {
            this.active = false;
        }
    }

    render(ctx) {
        const alpha = 1 - (this.age / this.lifetime);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 71, 87, ${alpha * 0.5})`;
        ctx.fill();
        ctx.closePath();
    }

    isPlayerInside(playerBounds) {
        const playerCenterX = playerBounds.x + playerBounds.width / 2;
        const playerCenterY = playerBounds.y + playerBounds.height / 2;

        const distance = Math.sqrt(
            Math.pow(playerCenterX - this.x, 2) +
            Math.pow(playerCenterY - this.y, 2)
        );

        return distance < this.currentRadius;
    }

    isActive() {
        return this.active;
    }
}

export class SplashManager {
    constructor() {
        this.splashes = [];
    }

    addSplash(x, y, radius) {
        this.splashes.push(new Splash(x, y, radius));
    }

    update(deltaTime) {
        for (let splash of this.splashes) {
            splash.update(deltaTime);
        }

        // Remove inactive splashes
        this.splashes = this.splashes.filter(splash => splash.isActive());
    }

    render(ctx) {
        for (let splash of this.splashes) {
            splash.render(ctx);
        }
    }

    checkPlayerCollision(playerBounds) {
        for (let splash of this.splashes) {
            if (splash.isPlayerInside(playerBounds)) {
                return true;
            }
        }
        return false;
    }

    clear() {
        this.splashes = [];
    }
}
