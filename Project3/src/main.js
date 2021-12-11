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
    eyes = {};

const GAMESTATE = Object.freeze({
    MENU: Symbol("MENU"),
    GAME: Symbol("GAME"),
    PAUSE: Symbol("PAUSE"),
    END: Symbol("END")
});


const enemyDimensions = { width: 100, height: 50 };
const hitpointRad = 10;
let state = GAMESTATE.MENU;

let enemies = [];
let hitpoints = {};
let score = 0;
let health = 100;
let enemySpeed = 150;
let myPose;
let images;
let sounds;
let face;
let frame;


async function init(tmPose, imageData, soundData) {
    //console.log('init called');
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

    frame = 0;

    //save imageData and create enemies
    images = imageData;
    sounds = soundData;
    // enemies = utils.createEnemy(images.ufo, Circle, 5, enemySpeed, enemyDimensions.width, enemyDimensions.height, {
    //     width: canvasElement.width,
    //     height: canvasElement.height
    // });
    enemies = utils.createEnemy2(images.test, Circle, 5, enemySpeed, enemyDimensions.width, enemyDimensions.height, {
        width: canvasElement.width,
        height: canvasElement.height
    });
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

    let shoulderWidth = utils.getDistance(myPose[5].position, myPose[6].position);
    hitpoints = {
        'head': new Circle(myPose[0].position.x, myPose[0].position.y, shoulderWidth * .4), //Use nose as center and 40% of the distance between the shoulders as radius
        'chest': new Circle(myPose[6].position.x + (myPose[11].position.x - myPose[6].position.x) / 2, myPose[6].position.y + (myPose[11].position.y - myPose[6].position.y) / 2, shoulderWidth / 2),
        'shoulder1': new Circle(myPose[5].position.x, myPose[5].position.y, hitpointRad),
        'shoulder2': new Circle(myPose[6].position.x, myPose[6].position.y, hitpointRad),
        'elbow1': new Circle(myPose[7].position.x, myPose[7].position.y, hitpointRad),
        'elbow2': new Circle(myPose[8].position.x, myPose[8].position.y, hitpointRad),
        'wrist1': new Circle(myPose[9].position.x, myPose[9].position.y, hitpointRad),
        'wrist2': new Circle(myPose[10].position.x, myPose[10].position.y, hitpointRad)
    };

    eyes = {
        'left': new Circle(myPose[1].position.x, myPose[1].position.y, shoulderWidth * .05),
        'right': new Circle(myPose[2].position.x, myPose[2].position.y, shoulderWidth * .05)
    };
}

async function loop() {
    window.requestAnimationFrame(loop, 1 / fps);
    frame++;
    switch (state) {
        case GAMESTATE.MENU:

            break;
        case GAMESTATE.GAME:
            webcam.update(); // update the webcam frame
            if (myPose) {
                canvas.drawHUD(score, health);

                canvas.drawFace(hitpoints['head'], eyes, face);
                //draw the pose
                canvas.drawPose(myPose);
            }
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

                    //check collision with hitpoints
                    for (let k of Object.keys(hitpoints)) {
                        if (enemyCircle.intersects(hitpoints[k])) {
                            frame = 1;
                            s.isDead = true;
                            if (k == 'wrist1') { //check if its a wrist
                                sounds['punch'].play();
                                score++;
                                face = canvas.FACESTATE.SMILE;
                                //set enemy direction to reflect the punch
                                s.fwd.x = (hitpoints['wrist1'].x - hitpoints['elbow1'].x) / 10;
                                s.fwd.y = (hitpoints['wrist1'].y - hitpoints['elbow1'].y) / 10;
                            } else if (k == 'wrist2') { //check if its a wrist
                                sounds['punch'].play();
                                score++;
                                face = canvas.FACESTATE.SMILE;
                                //set enemy direction to reflect the punch
                                s.fwd.x = (hitpoints['wrist2'].x - hitpoints['elbow2'].x) / 10;
                                s.fwd.y = (hitpoints['wrist2'].y - hitpoints['elbow2'].y) / 10;
                            } else {
                                sounds['hit'].play();
                                health -= 10;
                                face = canvas.FACESTATE.FROWN;
                                s.offscreen = true;
                                if (health < 10) {
                                    state = GAMESTATE.END;
                                }
                            }
                        }
                    }
                } else { //check if enemy has left the screen and mark off
                    if (s.x < 0 || s.x > canvasElement.width || s.y < 0 || s.y > canvasElement.height) {
                        s.offscreen = true;
                    }
                }
                s.move(1 / fps, hitpoints['head']);
                // draw sprites
                s.draw(ctx);

            } // end for

            //remove enemies that have been hit and are off screen
            enemies = enemies.filter(s => !s.offscreen || !s.isDead);
            //create more enemies
            if (enemies.length == 0) enemies = utils.createEnemy(images.ufo, Circle, 5, enemySpeed + score, enemyDimensions.width, enemyDimensions.height, {
                width: canvasElement.width,
                height: canvasElement.height
            });

            await predict();

            //every 30 frames, reset the face
            if (frame % 30 == 0)
                face = canvas.FACESTATE.DEFAULT;
            canvas.reset();
            break;
        case GAMESTATE.PAUSE:

            break;
        case GAMESTATE.END:
            canvas.reset();
            webcam.update();
            if (myPose) {
                canvas.drawHUD(score, health);

                canvas.drawFace(hitpoints['head'], eyes, face);
                //draw the pose
                canvas.drawPose(myPose);
            }
            canvas.fillText("Do Better", canvasElement.width / 2, canvasElement.height / 2 - 40, "74pt 'Press Start 2P', cursive", "red");
            canvas.strokeText("Do Better", canvasElement.width / 2, canvasElement.height / 2 - 40, "74pt 'Press Start 2P', cursive", "black", 2);

            await predict();
            canvas.reset();
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
            sounds['music'].play();
            playButton.innerText = 'Pause';
        } else {
            state = GAMESTATE.PAUSE;
            playButton.innerText = 'Play';
            sounds['music'].stop();
            canvas.fillText("Game Paused", canvasElement.width / 2, canvasElement.height / 2 - 20, "40pt 'Press Start 2P', cursive", "red");
            canvas.strokeText("Game Paused", canvasElement.width / 2, canvasElement.height / 2 - 20, "40pt 'Press Start 2P', cursive", "black", 2);
        }
    }

    //clear any warning banners if they exist and set up the webcam
    //Set the hidden buttons as visible and hide this one
    setupWebcamButton.onclick = e => {
        utils.clearBanner();
        if (setupWebcam(tmPose)) {
            playButton.style.visibility = "visible";
            fsButton.style.visibility = "visible";
            e.target.style.display = "none";
        }
    }
} // end setupUI

// Convenience function to setup a webcam
async function setupWebcam(tmPose) {
    console.log('Setup Webcam called');
    if (webcam) return; //check if webcam is already set up
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(canvasElement.width, canvasElement.height, flip); // width, height, flip
    try {
        await webcam.setup(); // request access to the webcam
    } catch (e) {
        utils.showBanner('is-danger', "Webcam not set up. Set up webcam before playing");
        return false;
    }
    webcam.play();
    window.requestAnimationFrame(loop);
    //return true;
}

export { init };