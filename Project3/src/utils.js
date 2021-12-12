// Why are the all of these ES6 Arrow functions instead of regular JS functions?
// No particular reason, actually, just that it's good for you to get used to this syntax
// For Project 2 - any code added here MUST also use arrow function syntax
import Enemy2 from './Enemy2.js';
import Enemy3 from './Enemy3.js';
import Enemy from './Enemy.js'

const makeColor = (red, green, blue, alpha = 1) => {
    return `rgba(${red},${green},${blue},${alpha})`;
};

const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
};

const getRandomColor = () => {
    const floor = 35; // so that colors are not too bright or too dark 
    const getByte = () => getRandom(floor, 255 - floor);
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

const getLinearGradient = (ctx, startX, startY, endX, endY, colorStops) => {
    let lg = ctx.createLinearGradient(startX, startY, endX, endY);
    for (let stop of colorStops) {
        lg.addColorStop(stop.percent, stop.color);
    }
    return lg;
};

const goFullscreen = (element) => {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
};

const getRandomUnitVector = () => {
    let x = getRandom(-1, 1);
    let y = getRandom(-1, 1);
    let length = Math.sqrt(x * x + y * y);
    if (length == 0) { // very unlikely
        x = 1; // point right
        y = 0;
        length = 1;
    } else {
        x /= length;
        y /= length;
    }

    return { x: x, y: y };
}

//returns the distance between two vectors
const getDistance = (a, b) => {
    let d1 = b.x - a.x;
    let d2 = b.y - a.y;

    return Math.hypot(d1, d2);
}

//Creates enemies outside the bounding area of the rect moving towards it
function createEnemy(image, enemyType, num = 10, speed = 100, width = 50, height = 50, canvas = { width: 900, height: 400 }) {

    let sprites = [];
    for (let i = 0; i < num; i++) {
        //create objects on the rignt of the canvas
        let s = new enemyType(Math.random() * canvas.width + canvas.width,
            Math.random() * 0.7 * canvas.height + canvas.height * .15, { x: -Math.random() - .5, y: 0 },
            speed,
            false,
            width,
            height,
            image,
            enemyType,
            true);

        //randomly change objects to the left
        if (Math.random() >= .5) {
            s.x *= -1;
            s.x += canvas.width;
            s.fwd.x *= -1;
        } else {
            console.log('RIGHT');
        }
        sprites.push(s);
    }
    return sprites;

}

//Creates enemies outside the bounding area of the rect moving towards it
function createEnemy2(image, type, num = 10, speed = 100, width = 50, height = 50, canvas = { width: 900, height: 400 }) {

    let sprites = [];
    for (let i = 0; i < num; i++) {
        let rand = Math.random();

        //create objects on the rignt of the canvas
        let s = new Enemy3(rand * canvas.width + canvas.width,
            rand * 0.7 * canvas.height + canvas.height * .15, { x: -rand - .5, y: 0 },
            speed,
            false,
            width,
            height,
            image,
            type,
            true);

        //randomly change objects to the left
        if (rand >= .5) {
            s.x *= -1;
            s.x += canvas.width;
            s.fwd.x *= -1;
        } else {
            console.log('RIGHT');
        }
        sprites.push(s);
    }
    return sprites;

}

//param type of banner being shown
//displays message on the screen
//note the colour is in bulma colours (eg. is-warning for yellow)
const showBanner = (colour, message) => {
    warningMessage.innerHTML = `<div class="container notification title ${colour}">${message}</div>`;
}

const clearBanner = () => {
    warningMessage.innerHTML = null;
}

export { createEnemy2, clearBanner, makeColor, getDistance, getRandomColor, getLinearGradient, goFullscreen, getRandomUnitVector, createEnemy, showBanner };