import Enemy from './Enemy.js'

export default class Enemy2 extends Enemy {
    constructor(x, y, fwd, speed, isDead, width, height, image, type, offscreen) {
        super(x, y, fwd, speed, isDead, width, height, image, type, offscreen);

        this.angularSpeed = 0;
    }

    //sin
    move(dt = 1 / 60) {
        this.angularSpeed += .1;

        this.x += this.fwd.x * this.speed * dt;
        this.y += Math.sin(this.angularSpeed) * 5;
    }
}