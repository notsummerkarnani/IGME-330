import ImageSprite from './ImageSprite.js'

export default class Enemy2 extends ImageSprite {
    constructor(x, y, fwd, speed, isDead, width, height, image, type, offscreen) {
        super(x, y, fwd, speed, isDead, width, height, image, type, offscreen);

        this.angularSpeed = 0;
    }

    move(dt = 1 / 60) {
        this.angularSpeed += .1;

        this.x += this.fwd.x * this.speed * dt;
        this.y += Math.sin(this.angularSpeed) * 2
    }
}