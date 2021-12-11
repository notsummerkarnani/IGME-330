import sprite from './sprite.js'

export default class Enemy extends sprite {
    constructor(x, y, fwd, speed, isDead, width, height, image, type, offscreen) {
        super(x, y, fwd, speed, isDead);
        this.width = width;
        this.height = height;
        this.image = image;
        this.type = type;
        this.offscreen = offscreen;
    }

    draw(ctx) {
        if (this.offscreen && this.isDead) return;
        ctx.save();
        if (this.fwd.x < 0) ctx.scale(-1, 1);
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}