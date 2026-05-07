export class CollisionManager {
    static checkRectangleCircle(rect, circle) {
        // Find the closest point on the rectangle to the circle center
        const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

        // Calculate distance between closest point and circle center
        const distanceX = circle.x - closestX;
        const distanceY = circle.y - closestY;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;

        // Check if distance is less than radius
        return distanceSquared < circle.radius * circle.radius;
    }

    static checkPlayerDropCollision(player, drop) {
        const playerBounds = player.getBounds();
        const dropPosition = drop.getPosition();

        return this.checkRectangleCircle(playerBounds, {
            x: dropPosition.x,
            y: dropPosition.y,
            radius: drop.radius
        });
    }

    static checkPlayerSplashCollision(player, splashManager) {
        const playerBounds = player.getBounds();
        return splashManager.checkPlayerCollision(playerBounds);
    }
}