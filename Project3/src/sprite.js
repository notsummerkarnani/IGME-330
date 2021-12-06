import rect from './rect.js'
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

    getRect() {
        return new rect(this.x, this.y, this.width, this.height);
    }

    // isColliding(rect) {
    //     myRect = new rect(this.x, this.y, this.width, this.height);

    //     if (rect.x < myRect.x + myRect.width &&
    //         rect.x + rect.width > myRect.x &&
    //         rect.y < myRect.y + myRect.height &&
    //         rect.height + rect.y > myRect.y) {
    //         return true;
    //     }
    //     return false;
    // }

    getCircle() {
        return new Circle(this.x + this.width / 2, this.y + this.height / 2, this.width / 2)
    }



}