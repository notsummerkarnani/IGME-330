export default class Circle {
    constructor(position = { x: 0, y: 0 }, radius = 0) {
        this.x = position.x;
        this.y = position.y;
        this.radius = radius;
    }

    intersects(circle) {
        if (!circle) return false;
        if (circle.radius <= 0 || this.radius <= 0) return false;
        let d1 = circle.x - this.x;
        let d2 = circle.y - this.y;

        return (this.radius + circle.radius >= Math.hypot(d1, d2));
    }
}