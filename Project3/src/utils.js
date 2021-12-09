// Why are the all of these ES6 Arrow functions instead of regular JS functions?
// No particular reason, actually, just that it's good for you to get used to this syntax
// For Project 2 - any code added here MUST also use arrow function syntax
import Enemy2 from './enemy2.js';
import ImageSprite from './ImageSprite.js'

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

function loadImages(imageSources, callback) {
    let numImages = Object.keys(imageSources).length;
    let numLoadedImages = 0;

    // load images
    console.log("... start loading images ...");
    for (let imageName in imageSources) {
        console.log("... trying to load '" + imageName + "'");
        let img = new Image();
        img.src = imageSources[imageName];
        imageSources[imageName] = img;
        img.onload = function() {
            console.log("SUCCESS: Image named '" + imageName + "' at " + this.src + " loaded!");
            if (++numLoadedImages >= numImages) {
                console.log("... done loading images ...");
                callback(imageSources);
            }
        }
        img.onerror = function() {
            console.log("ERROR: image named '" + imageName + "' at " + this.src + " did not load!");
        }
    }
}

function loadSounds(soundSources, callback) {
    let numSounds = Object.keys(soundSources).length;
    let numLoadedSounds = 0;

    // load sounds
    console.log("... start loading sounds ...");
    for (let soundName in soundSources) {
        console.log("... trying to load '" + soundName + "'");
        let sound = new Howl({ src: soundSources[soundName] });
        soundSources[soundName] = sound;
        sound.onload = function() {
            console.log("SUCCESS: sound named '" + soundName + "' at " + this.src + " loaded!");
            if (++numLoadedSounds >= numSounds) {
                console.log("... done loading sounds ...");
                callback(soundSources);
            }
        }
        img.onerror = function() {
            console.log("ERROR: sound named '" + soundName + "' at " + this.src + " did not load!");
        }
    }
}

//returns the distance between two vectors
const getDistance = (a, b) => {
    let d1 = b.x - a.x;
    let d2 = b.y - a.y;

    return Math.hypot(d1, d2);
}

//Creates enemies outside the bounding area of the rect moving towards it
function createImageSprite(image, type, num = 10, speed = 100, width = 50, height = 50, canvas = { width: 900, height: 400 }) {

    let sprites = [];
    for (let i = 0; i < num; i++) {
        //create objects on the rignt of the canvas
        let s = new ImageSprite(Math.random() * canvas.width + canvas.width,
            Math.random() * 0.7 * canvas.height + canvas.height * .15, { x: -Math.random() - .5, y: 0 },
            speed,
            false,
            width,
            height,
            image,
            type,
            true);

        //randomly change objects to the left
        if (Math.random() >= .5) {
            s.x *= -1;
            s.x += canvas.width;
            s.fwd.x *= -1;
        }
        sprites.push(s);
    }
    return sprites;

}

//Creates enemies outside the bounding area of the rect moving towards it
function createEnemy2(image, type, num = 10, speed = 100, width = 50, height = 50, canvas = { width: 900, height: 400 }) {

    let sprites = [];
    for (let i = 0; i < num; i++) {
        //create objects on the rignt of the canvas
        let s = new Enemy2(Math.random() * canvas.width + canvas.width,
            Math.random() * 0.7 * canvas.height + canvas.height * .15, { x: -Math.random() - .5, y: 0 },
            speed,
            false,
            width,
            height,
            image,
            type,
            true);

        //randomly change objects to the left
        if (Math.random() >= .5) {
            s.x *= -1;
            s.x += canvas.width;
            s.fwd.x *= -1;
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

export { createEnemy2, clearBanner, makeColor, getDistance, getRandomColor, getLinearGradient, goFullscreen, getRandomUnitVector, loadImages, createImageSprite, showBanner };