/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as canvas from './canvas.js';
//import * as manager from './manager.js';
import Rect from './rect.js';


// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
const URL = 'https://teachablemachine.withgoogle.com/models/7tEeCg_ln/';

let model, webcam, ctx, fps = 60,
    canvasElement,
    wrists = {},
    elbows = {};

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

    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    // load the model and metadata
    // Refer to tmPose.loadFromFiles() in the API to support files from a file picker
    model = await tmPose.load(modelURL, metadataURL);

    // append/get elements to the DOM
    canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupUI(canvasElement, tmPose);
    canvas.setupCanvas(canvasElement);
    ctx = canvasElement.getContext('2d');

    // Convenience function to setup a webcam
    // const flip = true; // whether to flip the webcam
    // webcam = new tmPose.Webcam(canvasElement.width, canvasElement.height, flip); // width, height, flip
    // await webcam.setup(); // request access to the webcam
    // webcam.play();

    //save imageData and create enemies
    images = imageData;
    enemies = utils.createImageSprite(images.ufo, Rect, 5, 100, 50, {
        left: canvasElement.width,
        top: 0,
        width: canvasElement.width,
        height: canvasElement.height
    });
    //loop();
}

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const {
        pose,
        posenetOutput
    } = await model.estimatePose(webcam.canvas);
    if (!pose) return;
    myPose = pose.keypoints;
    elbows.left = myPose[7].position
    elbows.right = myPose[8].position
    wrists.left = myPose[9].position;
    wrists.right = myPose[10].position;
}

async function loop() {
    window.requestAnimationFrame(loop, 1 / fps);

    switch (state) {
        case GAMESTATE.MENU:

            break;
        case GAMESTATE.GAME:
            canvas.reset();
            webcam.update(); // update the webcam frame
            for (let s of enemies) {
                if (!s.isDead) { // as long as enemy hasnt been hit
                    //if enemy is onscreen
                    if (s.offscreen) { //reflect enemy off walls
                        if (s.x > 0 && s.x < canvasElement.width - s.width / 2) {
                            s.offscreen = false;
                        }
                    } else {
                        if (s.x < 0 || s.x > canvasElement.width - s.width / 2) {
                            s.reflectX();
                        }
                    }

                    //check for collision with wrists and assign new fwd vector to enemy
                    if (s.getRect().containsPoint(wrists['left'])) {
                        score++;
                        s.isDead = true;
                        s.fwd.x = (wrists['left'].x - elbows['left'].x) / 10;
                        s.fwd.y = (wrists['left'].y - elbows['left'].y) / 10;
                    }
                    if (s.getRect().containsPoint(wrists['right'])) {
                        score++;
                        s.isDead = true;
                        s.fwd.x = (wrists['right'].x - elbows['right'].x) / 10;
                        s.fwd.y = (wrists['right'].y - elbows['right'].y) / 10;
                    }

                } else { //check if enemy has left the screen and mark off
                    if (s.x < 0 || s.x > canvasElement.width || s.y < 0 || s.y > canvasElement.height) {
                        s.offscreen = true;
                    }
                }

                s.move();
                // draw sprites

                s.draw(ctx);

            } // end for
            enemies = enemies.filter(s => !s.offscreen || !s.isDead);
            if (enemies.length == 0) enemies = utils.createImageSprite(images.ufo, Rect, 5, 100, 50, {
                left: canvasElement.width,
                top: 0,
                width: canvasElement.width,
                height: canvasElement.height
            });

            //console.log(enemies);
            canvas.drawHUD(score, health);
            await predict();
            if (!myPose) break;

            //Draw Player head using nose and 

            canvas.drawCircle(ctx, myPose[0].position, utils.getDistance(myPose[5].position, myPose[6].position) * .4, 'green');
            canvas.drawRect2(ctx, myPose[5].position, myPose[6].position, myPose[12].position, myPose[11].position, 'black');
            canvas.drawPose(myPose);
            break;
        case GAMESTATE.PAUSE:

            break;
        case GAMESTATE.END:

            break;
    }
}

//Set up the UI elemeents
function setupUI(canvasElement, tmPose) {
    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("init called");
        utils.goFullscreen(canvasElement);
    };

    playButton.onclick = e => {
        if (state != GAMESTATE.GAME) {
            //check if webcam is set up, if not show error
            if (!webcam) {
                utils.showBanner('is-danger', "Webcam not set up. Set up webcam before playing");
                return;
            }
            state = GAMESTATE.GAME;
            playButton.innerText = 'Pause';
        } else {
            state = GAMESTATE.PAUSE;
            playButton.innerText = 'Play';
            canvas.fillText(ctx, "Game Paused", canvasElement.width / 2, canvasElement.height / 2 - 20, "40pt 'Press Start 2P', cursive", "red");
            canvas.strokeText(ctx, "Game Paused", canvasElement.width / 2, canvasElement.height / 2 - 20, "40pt 'Press Start 2P', cursive", "black", 2);

        }
    }

    //clear any warning banners if they exist and set up the webcam
    setupWebcamButton.onclick = e => {
        utils.clearBanner();
        setupWebcam(tmPose);
    }
} // end setupUI

// Convenience function to setup a webcam
async function setupWebcam(tmPose) {
    console.log('Setup Webcam called');
    if (webcam) return; //check if webcam is already set up
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(canvasElement.width, canvasElement.height, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    webcam.play();
    window.requestAnimationFrame(loop);
}

export { init };