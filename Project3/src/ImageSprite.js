import sprite from './sprite.js'

export default class ImageSprite extends sprite {
    constructor(x, y, fwd, speed, isDead, width, height, image, type, offscreen) {
        super(x, y, fwd, speed, isDead);
        this.width = width;
        this.height = height;
        this.image = image;
        this.type = type;
        this.offscreen = offscreen;
    }

    draw(ctx) {
        ctx.save();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}