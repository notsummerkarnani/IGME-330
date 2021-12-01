import rect from './rect.js'

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

}