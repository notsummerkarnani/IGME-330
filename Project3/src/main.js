/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as canvas from './canvas.js';
import Rect from './rect.js';


// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
const URL = 'https://teachablemachine.withgoogle.com/models/7tEeCg_ln/';

let model, webcam, ctx, fps = 60,
    canvasElement,
    wrists = {};

const GAMESTATE = Object.freeze({
    MENU: Symbol("MENU"),
    GAME: Symbol("GAME"),
    PAUSE: Symbol("PAUSE"),
    END: Symbol("END")
});

let state = GAMESTATE.MENU;

let enemies = [];
let score = 0;
let health = 100;
let myPose;

let images;
async function init(tmPose, imageData) {

    console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);

    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    // load the model and metadata
    // Refer to tmPose.loadFromFiles() in the API to support files from a file picker
    model = await tmPose.load(modelURL, metadataURL);

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(900, 400, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    webcam.play();
    window.requestAnimationFrame(loop);

    // append/get elements to the DOM
    canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement);
    ctx = canvasElement.getContext('2d');

    //save imageData and create enemies
    images = imageData;
    enemies = utils.createImageSprite(imageData.cage1, Rect, 5);
    //console.log(enemies);
    loop();
}

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const {
        pose,
        posenetOutput
    } = await model.estimatePose(webcam.canvas);
    if (!pose) return;
    myPose = pose;
    wrists.left = pose.keypoints[9].position;
    wrists.right = pose.keypoints[10].position;
}

function setupUI(canvasElement) {
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fsButton");

    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("init called");
        utils.goFullscreen(canvasElement);
    };

    playButton.onclick = e => {
        if (state != GAMESTATE.GAME) {
            state = GAMESTATE.GAME;
            playButton.innerText = 'Pause';


        } else {
            state = GAMESTATE.PAUSE;
            playButton.innerText = 'Play';
            canvas.fillText(ctx, "Game Paused", canvasElement.width / 2, canvasElement.height / 2 - 20, "40pt 'Press Start 2P', cursive", "red");
            canvas.strokeText(ctx, "Game Paused", canvasElement.width / 2, canvasElement.height / 2 - 20, "40pt 'Press Start 2P', cursive", "black", 2);

        }
    }
} // end setupUI

async function loop() {
    window.requestAnimationFrame(loop, 1 / fps);

    switch (state) {
        case GAMESTATE.MENU:

            break;
        case GAMESTATE.GAME:
            canvas.reset();
            webcam.update(); // update the webcam frame
            for (let s of enemies) {
                if (s.x < 0 || s.x > canvasElement.width) {
                    s.reflectX();
                }
                if (s.y < 0 || s.y > canvasElement.height) {
                    s.reflectY();
                }

                s.move();
                // draw sprites

                s.draw(ctx);

                //console.log(s.getRect()); //.containsPoint({ x: 30, y: 30 }));
                //console.log(wrists['left']) // + " " + wrists.right);
                if (!s.isDead && (s.getRect().containsPoint(wrists['left']) || s.getRect().containsPoint(wrists['right']))) {
                    score++; //console.log('hit');
                    s.isDead = true;
                    //if (enemies.length == 0) enemies = utils.createImageSprite(imageData.cage1, Rect, 1);
                }

            } // end for
            enemies = enemies.filter(s => s.isDead == false)
            console.log(enemies.length);
            if (enemies.length == 0) enemies = utils.createImageSprite(images.cage1, Rect, 1);

            //enemies = enemies.filter(s => { s.speed == 0 })
            //console.log(enemies);
            canvas.drawHUD(score, health);
            await predict();
            if (!myPose) break;
            canvas.drawPose(myPose);
            break;
        case GAMESTATE.PAUSE:

            break;
        case GAMESTATE.END:

            break;
    }
}

export { init };