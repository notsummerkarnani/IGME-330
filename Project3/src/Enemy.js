import ImageSprite from './ImageSprite.js';

export default class Enemy extends ImageSprite {
    constructor(x, y, fwd, speed, isDead, width, height, image, type, offscreen) {
        super(x, y, fwd, speed, isDead, width, height, image, type, offscreen);

    }

    draw(ctx) {
        if (this.offscreen && this.isDead) return;
        ctx.save();

        //if this causes performance issues switch to symmetric circle sprites
        if (this.fwd.x < 0) { //check to make sure image is pointed in the right dir
            ctx.scale(-1, 1); //flip image
            ctx.drawImage(this.image, -this.x, this.y, this.width, this.height); //account for negative x
        } else {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }

        ctx.restore();
    }
}