import { Drop } from './drops.js?v=4';

const BIRD_STATE = {
    FLYING: 'flying',
    HOVERING: 'hovering'
};

export class Bird {
    static isAnyBirdHovering = false;

    constructor(canvasWidth, canvasHeight, birdId) {
        this.width = 110;
        this.height = 65;
        this.x = Math.random() * (canvasWidth - this.width);
        this.baseY = 50 + birdId * 70;
        this.y = this.baseY;
        this.speed = 120 + Math.random() * 80;
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.dropTimer = 0;
        this.dropInterval = 0.6 + Math.random() * 0.4;
        this.changeDirectionTimer = 0;
        this.changeDirectionInterval = 1 + Math.random() * 2;
        this.wingAngle = 0;
        this.wingDir = 1;

        // Animation frame cycling (0, 1, 2 → bird1, bird2, bird3)
        this.animFrame = 0;
        this.animTimer = 0;
        this.animSpeed = 0.12; // seconds per frame
        
        // Smarter movement properties
        this.bobAmount = 15 + Math.random() * 10;
        this.bobSpeed = 2 + Math.random() * 2;
        this.bobOffset = Math.random() * Math.PI * 2;

        // State machine
        this.state = BIRD_STATE.FLYING;
        this.stateTimer = 0;
        this.stateDuration = 3 + Math.random() * 4;
        this.hoverAngle = 0; // For spreading shots
        
        this.images = [];
        ['assets/bird1.png', 'assets/bird2.png', 'assets/bird3.png'].forEach(src => {
            const img = new Image();
            img.src = src;
            this.images.push(img);
        });
    }

    update(deltaTime, dropManager, difficultyManager, player) {
        this.stateTimer += deltaTime;

        if (this.stateTimer >= this.stateDuration) {
            this.stateTimer = 0;
            if (this.state === BIRD_STATE.FLYING) {
                // Only enter hovering if NO OTHER bird is currently hovering
                if (!Bird.isAnyBirdHovering) {
                    this.state = BIRD_STATE.HOVERING;
                    Bird.isAnyBirdHovering = true;
                    this.stateDuration = 2 + Math.random() * 2;
                } else {
                    // Stay flying if someone else is hovering
                    this.stateDuration = 1 + Math.random(); 
                }
            } else {
                // Leaving hovering state
                this.state = BIRD_STATE.FLYING;
                Bird.isAnyBirdHovering = false;
                this.stateDuration = 3 + Math.random() * 4;
                this.direction = Math.random() > 0.5 ? 1 : -1;
            }
        }

        if (this.state === BIRD_STATE.FLYING) {
            // Move horizontally
            this.x += this.speed * this.direction * deltaTime;

            // Boundary checks
            if (this.x <= 0) { this.x = 0; this.direction = 1; this.speed = 120 + Math.random() * 150; }
            if (this.x + this.width >= this.canvasWidth) { this.x = this.canvasWidth - this.width; this.direction = -1; this.speed = 120 + Math.random() * 150; }

            // Random direction changes
            this.changeDirectionTimer += deltaTime;
            if (this.changeDirectionTimer >= this.changeDirectionInterval) {
                this.changeDirectionTimer = 0;
                this.changeDirectionInterval = 1 + Math.random() * 2;
                if (Math.random() < 0.3) {
                    this.direction *= -1;
                    this.speed = 120 + Math.random() * 150;
                }
            }
        }

        // Bob up and down (applies to both states)
        this.y = this.baseY + Math.sin(Date.now() * 0.001 * this.bobSpeed + this.bobOffset) * this.bobAmount;

        // Wing flap animation
        this.wingAngle += this.wingDir * deltaTime * 10;
        if (this.wingAngle > 0.7) this.wingDir = -1;
        if (this.wingAngle < -0.7) this.wingDir = 1;

        // Cycle through bird1 → bird2 → bird3 → bird2 → bird1 ...
        this.animTimer += deltaTime;
        if (this.animTimer >= this.animSpeed) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 4;
        }

        // Shooting
        this.dropTimer += deltaTime;
        let adjustedInterval = this.dropInterval / difficultyManager.getDropFrequencyMultiplier();
        if (this.state === BIRD_STATE.HOVERING) adjustedInterval *= 0.6;

        if (this.dropTimer >= adjustedInterval) {
            this.dropTimer = 0;
            this.drop(dropManager, difficultyManager, player);
        }
    }

    drop(dropManager, difficultyManager, player) {
        const speedMultiplier = difficultyManager.getSpeedMultiplier();
        const dropY = this.y + this.height;
        const centerX = this.x + this.width / 2;
        
        if (this.state === BIRD_STATE.HOVERING) {
            // Turret mode: Fire 3 drops in a fan pattern
            const angles = [-0.5, 0, 0.5]; 
            angles.forEach(angleOffset => {
                const size = difficultyManager.getRandomDropSize();
                const baseSpeed = this.getDropBaseSpeed(size) * speedMultiplier;
                const vX = Math.sin(angleOffset) * baseSpeed * 0.5;
                const vY = Math.cos(angleOffset) * baseSpeed;
                
                const drop = new Drop(centerX, dropY, size, 1, vX);
                drop.speedY = vY;
                dropManager.addDrop(drop);
            });
            return;
        }

        // Standard Flying logic (targeted attacks) - Single drop only
        const playerCenterX = player.x + player.width / 2;
        const targetX = playerCenterX;
        const targetY = player.y + player.height / 2;
        const distY = targetY - dropY;
        
        const size = difficultyManager.getRandomDropSize();
        const baseSpeed = this.getDropBaseSpeed(size) * speedMultiplier;
        const timeToHit = distY / baseSpeed;
        const aimVelocityX = (targetX - centerX) / timeToHit;
        
        const maxAim = 150 * speedMultiplier;
        const vX = Math.max(-maxAim, Math.min(maxAim, aimVelocityX));
        
        const drop = new Drop(centerX, dropY, size, speedMultiplier, vX);
        dropManager.addDrop(drop);
    }

    getDropBaseSpeed(size) {
        switch (size) {
            case 'small': return 220;
            case 'medium': return 240;
            default: return 220;
        }
    }

    render(ctx) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        ctx.save();

        // Glow
        const grd = ctx.createRadialGradient(cx, cy, 2, cx, cy, 30);
        grd.addColorStop(0, 'rgba(255, 107, 53, 0.3)');
        grd.addColorStop(1, 'rgba(255, 107, 53, 0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 30, 22, 0, 0, Math.PI * 2);
        ctx.fill();

        // Frame sequence: 0→bird1, 1→bird2, 2→bird3, 3→bird2 (ping-pong)
        const frameIndex = [0, 1, 2, 1][this.animFrame];
        const img = this.images[frameIndex];
        if (img && img.complete) {
            ctx.translate(cx, cy);

            if (this.direction < 0) {
                ctx.scale(-1, 1);
            }

            ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
        }

        ctx.restore();
    }

    resize(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.x = Math.min(this.x, canvasWidth - this.width);
    }
}

export class BirdManager {
    constructor() {
        this.birds = [];
    }

    addBird(bird) { this.birds.push(bird); }

    update(deltaTime, dropManager, difficultyManager, player) {
        for (let bird of this.birds) {
            bird.update(deltaTime, dropManager, difficultyManager, player);
        }
    }

    render(ctx) {
        for (let bird of this.birds) {
            bird.render(ctx);
        }
    }

    resize(canvasWidth, canvasHeight) {
        for (let bird of this.birds) {
            bird.resize(canvasWidth, canvasHeight);
        }
    }

    clear() { this.birds = []; }
}

