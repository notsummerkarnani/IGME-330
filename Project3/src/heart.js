import ImageSprite from './ImageSprite.js';

export default class Heart extends ImageSprite {
    constructor(x, y, fwd, speed, isDead, width, height, image, type, offscreen) {
        super(x, y, fwd, speed, isDead, width, height, image, type, offscreen);
    }
}