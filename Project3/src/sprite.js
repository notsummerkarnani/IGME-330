import Circle from './circle.js';

export default class Sprite {
    constructor(x, y, fwd, speed, isDead) {
        this.x = x;
        this.y = y;
        this.fwd = fwd;
        this.speed = speed;
        this.isDead = isDead;
    }

    move(dt = 1 / 60) {
        this.x += this.fwd.x * this.speed * dt;
        this.y += this.fwd.y * this.speed * dt;
    }

    reflectX() {
        this.fwd.x *= -1;
    }

    reflectY() {
        this.fwd.y *= -1;
    }

    getCircle() {
        return new Circle(this.x + this.width / 2, this.y + this.height / 2, this.width / 2)
    }



}