export default class Circle {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    intersects(circle) {
        if (!circle) return false;
        if (circle.radius <= 0 || this.radius <= 0) return false;
        let d1 = circle.x - this.x;
        let d2 = circle.y - this.y;

        return (this.radius <= Math.sqrt(d1 * d1 + d2 * d2));
    }
}