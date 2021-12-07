/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as canvas from './canvas.js';
import Circle from './circle.js';


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

const enemyDimensions = { width: 100, height: 50 };
const hitpointRad = 5;
let state = GAMESTATE.MENU;

let enemies = [];
let hitpoints = {};
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

    //save imageData and create enemies
    images = imageData;
    enemies = utils.createImageSprite(images.ufo, Circle, 5, enemyDimensions.width, enemyDimensions.height, {
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
    //console.log(myPose);

    //Use nose as center and 40% of the distance between the shoulders as radius
    let head = new Circle(myPose[0].position.x, myPose[0].position.y, utils.getDistance(myPose[5].position, myPose[6].position) * .4)

    let shoulder1 = new Circle(myPose[5].position.x, myPose[5].position.y, hitpointRad);
    let shoulder2 = new Circle(myPose[6].position.x, myPose[6].position.y, hitpointRad);

    let elbow1 = new Circle(myPose[7].position.x, myPose[7].position.y, hitpointRad);
    let elbow2 = new Circle(myPose[8].position.x, myPose[8].position.y, hitpointRad);

    hitpoints = {
        'head': head,
        'shoulder1': shoulder1,
        'shoulder2': shoulder2,
        'elbow1': elbow1,
        'elbow2': elbow2,
    };
    elbows.left = myPose[7].position;
    elbows.right = myPose[8].position;
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

            canvas.drawHUD(score, health);
            await predict();
            if (!myPose) break;

            //Draw Player head
            canvas.drawCircle(hitpoints['head'].x, hitpoints['head'].y, hitpoints['head'].radius, 'green');

            //draw the pose
            canvas.drawPose(myPose);

            //loop through enemies
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

                    let enemyCircle = s.getCircle();
                    //checking collision between wrist circle and enemy circle
                    if (enemyCircle.intersects(new Circle(wrists['left'].x, wrists['left'].y, 10))) {
                        score++;
                        s.isDead = true;
                        s.fwd.x = (wrists['left'].x - elbows['left'].x) / 10;
                        s.fwd.y = (wrists['left'].y - elbows['left'].y) / 10;
                    }
                    if (enemyCircle.intersects(new Circle(wrists['right'].x, wrists['right'].y, 10))) {
                        score++;
                        s.isDead = true;
                        s.fwd.x = (wrists['right'].x - elbows['right'].x) / 10;
                        s.fwd.y = (wrists['right'].y - elbows['right'].y) / 10;
                    }

                    //check collision with hitpoints
                    for (let k of Object.keys(hitpoints)) {
                        if (enemyCircle.intersects(hitpoints[k])) {
                            health -= 10;
                            s.isDead = true;
                            s.offscreen = true;
                            if (health < 10) {
                                state = GAMESTATE.END;
                            }
                        }
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

            //remove enemies that have been hit and are off screen
            enemies = enemies.filter(s => !s.offscreen || !s.isDead);
            //create more enemies
            if (enemies.length == 0) enemies = utils.createImageSprite(images.ufo, Circle, 5, enemyDimensions.width, enemyDimensions.height, {
                left: canvasElement.width,
                top: 0,
                width: canvasElement.width,
                height: canvasElement.height
            });

            break;
        case GAMESTATE.PAUSE:

            break;
        case GAMESTATE.END:

            break;
    }
}

//Set up the UI elemeents
function setupUI(canvasElement, tmPose) {

    //hide buttons until webcam is set up
    playButton.style.visibility = "hidden";
    fsButton.style.visibility = "hidden";

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
            canvas.fillText("Game Paused", canvasElement.width / 2, canvasElement.height / 2 - 20, "40pt 'Press Start 2P', cursive", "red");
            canvas.strokeText("Game Paused", canvasElement.width / 2, canvasElement.height / 2 - 20, "40pt 'Press Start 2P', cursive", "black", 2);
        }
    }

    //clear any warning banners if they exist and set up the webcam
    //Set the hidden buttons as visible and hide this one
    setupWebcamButton.onclick = e => {
        utils.clearBanner();
        setupWebcam(tmPose);
        playButton.style.visibility = "visible";
        fsButton.style.visibility = "visible";
        e.target.style.visibility = "hidden";
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