export class Player {
    constructor(canvasWidth, canvasHeight) {
        this.width = 120;
        this.height = 150;
        this.x = canvasWidth / 2 - this.width / 2;
        this.groundY = canvasHeight - this.height - 20;
        this.y = this.groundY;
        this.speed = 500;
        this.velocityX = 0;
        this.velocityY = 0;
        this.acceleration = 4500;
        this.friction = 0.90;
        this.gravity = 2500;
        this.jumpForce = -1000;
        this.onGround = true;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.animFrame = 0;
        this.animTimer = 0;
        this.shieldTimer = 0;
        
        this.image1 = new Image();
        this.image1.src = 'assets/player1.png';
        this.image2 = new Image();
        this.image2.src = 'assets/player2.png';
    }

    update(deltaTime, inputHandler) {
        // Horizontal movement
        if (inputHandler.isMovingLeft()) {
            this.velocityX -= this.acceleration * deltaTime;
        }
        if (inputHandler.isMovingRight()) {
            this.velocityX += this.acceleration * deltaTime;
        }

        this.velocityX *= this.friction;
        this.x += this.velocityX * deltaTime;

        // Vertical movement
        if (inputHandler.isJumping() && this.onGround) {
            this.velocityY = this.jumpForce;
            this.onGround = false;
        }

        // Apply gravity
        if (!this.onGround) {
            this.velocityY += this.gravity * deltaTime;
            this.y += this.velocityY * deltaTime;

            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.velocityY = 0;
                this.onGround = true;
            }
        }

        if (this.x < 0) { this.x = 0; this.velocityX = 0; }
        if (this.x + this.width > this.canvasWidth) { this.x = this.canvasWidth - this.width; this.velocityX = 0; }

        // Walk animation
        if (this.onGround && (Math.abs(this.velocityX) > 10)) {
            this.animTimer += deltaTime;
            if (this.animTimer > 0.15) {
                this.animTimer = 0;
                this.animFrame = (this.animFrame + 1) % 4;
            }
        } else {
            this.animFrame = 0;
        }

        // Update shield timer
        if (this.shieldTimer > 0) {
            this.shieldTimer -= deltaTime;
        }
    }

    startShield(duration = 2) {
        this.shieldTimer = duration;
    }

    isShielded() {
        return this.shieldTimer > 0;
    }

    render(ctx) {
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const legOffset = this.onGround ? [0, 4, 0, -4][this.animFrame] : 4;

        ctx.save();

        // ── Full-body Shield Effect (powerup) ──
        if (this.isShielded()) {
            ctx.beginPath();
            ctx.arc(cx, cy, 45, 0, Math.PI * 2);
            const shieldGrd = ctx.createRadialGradient(cx, cy, 35, cx, cy, 45);
            shieldGrd.addColorStop(0, 'rgba(0, 255, 255, 0)');
            shieldGrd.addColorStop(0.5, 'rgba(0, 255, 255, 0.3)');
            shieldGrd.addColorStop(1, 'rgba(0, 255, 255, 0.6)');
            ctx.fillStyle = shieldGrd;
            ctx.fill();
            
            // Shield border pulse
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.4 + Math.sin(Date.now() * 0.01) * 0.2})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }





        // Body glow (optional, you can keep or remove it)
        const grd = ctx.createRadialGradient(cx, cy, 4, cx, cy, 28);
        grd.addColorStop(0, 'rgba(0, 212, 255, 0.25)');
        grd.addColorStop(1, 'rgba(0, 212, 255, 0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 28, 30, 0, 0, Math.PI * 2);
        ctx.fill();

        const img = (this.animFrame % 2 === 0) ? this.image1 : this.image2;
        if (img.complete) {
            ctx.translate(cx, cy);
            
            // Flip horizontally if moving left
            if (this.velocityX < -0.1) {
                ctx.scale(-1, 1);
            }
            
            ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
        }

        ctx.restore();
    }

    getBounds() {
        // Full hittable area: torso + legs (used to detect any contact)
        return {
            x: this.x + this.width * 0.28,
            y: this.y + this.height * 0.18,
            width: this.width * 0.44,
            height: this.height * 0.72
        };
    }

    getTorsoBounds() {
        // Upper body only (head + torso) — hits here deal damage
        // Spans from 18% to 62% of sprite height, no overlap with legs
        return {
            x: this.x + this.width * 0.28,
            y: this.y + this.height * 0.18,
            width: this.width * 0.44,
            height: this.height * 0.44
        };
    }

    getLegBounds() {
        // Legs only — from 62% to 90% of sprite height, no overlap with torso
        return {
            x: this.x + this.width * 0.22,
            y: this.y + this.height * 0.62,
            width: this.width * 0.56,
            height: this.height * 0.28
        };
    }

    resize(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.groundY = canvasHeight - this.height - 20;
        if (this.onGround) {
            this.y = this.groundY;
        }
        this.x = Math.min(this.x, canvasWidth - this.width);
    }
}