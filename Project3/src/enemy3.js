import Enemy from './Enemy.js';
import Circle from './circle.js';

export default class Enemy3 extends Enemy {
    constructor(x, y, fwd, speed, isDead, width, height, image, type, offscreen) {
        super(x, y, fwd, speed, isDead, width, height, image, type, offscreen);
    }

    //heatseeking  
    move(dt = 1 / 60, head) {
        if (!head) return;
        this.fwd.x = head.x - this.x;
        this.fwd.y = head.y - this.y;

        let magnitude = Math.hypot(this.fwd.x, this.fwd.y);

        this.x += (this.fwd.x / magnitude) * this.speed * dt;
        this.y += (this.fwd.y / magnitude) * this.speed * dt;

        if (this.fwd == { x: 0, y: 0 }) this.isDead = true;
    }
}