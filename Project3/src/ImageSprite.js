import sprite from './sprite.js'

export default class ImageSprite extends sprite {
    constructor(x, y, fwd, speed, isDead, width, height, image, type) {
        super(x, y, fwd, speed, isDead);
        this.width = width;
        this.height = height;
        this.image = image;
        this.type = type;
    }

    draw(ctx) {
        if (this.isDead) return;
        ctx.save();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.restore();
    }
}