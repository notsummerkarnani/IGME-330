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
import * as manager from './Manager.js';


// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/pose

// the link to your model provided by Teachable Machine export panel
const URL = 'https://teachablemachine.withgoogle.com/models/7tEeCg_ln/';

let model, webcam, fps = 60,
    canvasElement,
    secondaryCanvas,
    ctx2,
    canvas1to2,
    finalScore,
    eyes = {};

const GAMESTATE = Object.freeze({
    MENU: Symbol("MENU"),
    GAME: Symbol("GAME"),
    PAUSE: Symbol("PAUSE"),
    END: Symbol("END")
});

const hitpointRad = 10;
let state = GAMESTATE.MENU;

let hitpoints = {};
let myPose;


async function init(tmPose, imageData, soundData) {
    //console.log('init called');
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    // load the model and metadata
    // Refer to tmPose.loadFromFiles() in the API to support files from a file picker
    model = await tmPose.load(modelURL, metadataURL);


    // append/get elements to the DOM
    let canvases = document.querySelectorAll("canvas");
    canvasElement = canvases[0]; // hookup main <canvas> element
    secondaryCanvas = canvases[1]; //second canvas to display webcam data
    ctx2 = secondaryCanvas.getContext("2d");
    canvas1to2 = secondaryCanvas.width / canvasElement.width;
    setupUI(canvasElement, tmPose);
    canvas.setupCanvas(canvasElement);

    //save sounds and setup enemies
    manager.init(imageData, soundData, canvasElement);
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
    webcam.update();

    //draw webcam data on second canvas
    ctx2.save();
    ctx2.drawImage(webcam.canvas, 0, 0, canvasElement.width, canvasElement.height, 0, 0, secondaryCanvas.width, secondaryCanvas.height);
    ctx2.restore();

    switch (state) {
        case GAMESTATE.MENU:
            if (myPose) {
                canvas.drawFace(hitpoints['head'], eyes, manager.face);
                //draw the pose
                canvas.drawPose(myPose);
            }
            canvas.fillText("Ensure that your whole", canvasElement.width / 2, canvasElement.height / 2 - 120, "44pt Play, sans-serif", "red");
            canvas.strokeText("Ensure that your whole", canvasElement.width / 2, canvasElement.height / 2 - 120, "44pt Play, sans-serif", "black", 2);
            canvas.fillText("Upper body is in frame", canvasElement.width / 2, canvasElement.height / 2 - 70, "44pt Play, sans-serif", "red");
            canvas.strokeText("Upper body is in frame", canvasElement.width / 2, canvasElement.height / 2 - 70, "44pt Play, sans-serif", "black", 2);

            canvas.fillText("Press 'Play to start!", canvasElement.width / 2, canvasElement.height / 2 + 10, "50pt Play, sans-serif", "red");
            canvas.strokeText("Press 'Play to start!", canvasElement.width / 2, canvasElement.height / 2 + 10, "50pt Play, sans-serif", "black", 2);

            await predict();
            canvas.reset();
            break;
        case GAMESTATE.GAME:
            // update the webcam frame
            if (myPose) {
                canvas.drawFace(hitpoints['head'], eyes, manager.face);
                //draw the pose
                canvas.drawPose(myPose);
            }

            //update enemy collisions and movement
            manager.update(hitpoints);


            if (manager.getHealth() < 10) {
                state = GAMESTATE.END;
                playButton.innerText = 'Restart';
                finalScore = manager.getScore();
            }
            await predict();

            canvas.reset();
            break;
        case GAMESTATE.PAUSE:

            break;
        case GAMESTATE.END:
            canvas.reset();

            if (myPose) {
                //canvas.drawHUD(score, health);

                canvas.drawFace(hitpoints['head'], eyes, manager.face);
                //draw the pose
                canvas.drawPose(myPose);
            }
            canvas.fillText("Final Score: " + finalScore, canvasElement.width / 2, canvasElement.height / 2 - 80, "74pt Play, sans-serif", "red");
            canvas.strokeText("Final Score: " + finalScore, canvasElement.width / 2, canvasElement.height / 2 - 80, "74pt Play, sans-serif", "black", 2);

            canvas.fillText("Do Better", canvasElement.width / 2, canvasElement.height / 2 + 20, "74pt Play, sans-serif", "red");
            canvas.strokeText("Do Better", canvasElement.width / 2, canvasElement.height / 2 + 20, "74pt Play, sans-serif", "black", 2);

            await predict();
            canvas.reset();
            break;
    }
}

//Set up the UI elemeents
function setupUI(canvasElement, tmPose) {

    secondaryCanvas.style.visibility = "hidden"

    //hide buttons until webcam is set up
    setupWebcamButton.classList += " is-primary";
    playButton.classList += " is-danger";

    playButton.onclick = e => {
        //check if webcam is set up, if not show error
        if (!webcam) {
            utils.showBanner('is-danger', "Webcam not set up. Set up webcam before playing");
            return;
        }

        switch (state) {
            case GAMESTATE.MENU:
                state = GAMESTATE.GAME;
                playButton.innerText = 'Pause';
                break;
            case GAMESTATE.GAME:
                state = GAMESTATE.PAUSE;
                playButton.innerText = 'Play';
                canvas.fillText("Game Paused", canvasElement.width / 2, canvasElement.height / 2 - 20, "40pt Play, sans-serif", "red");
                canvas.strokeText("Game Paused", canvasElement.width / 2, canvasElement.height / 2 - 20, "40pt Play, sans-serif", "black", 2);
                break;
            case GAMESTATE.PAUSE:
                state = GAMESTATE.GAME;
                playButton.innerText = 'Pause';
                break;
            case GAMESTATE.END:
                manager.reset();
                state = GAMESTATE.GAME;
                playButton.innerText = 'Pause';
                break;
            default:
                break;
        }
    }

    //clear any warning banners if they exist and set up the webcam
    //change button colours and hide this one
    setupWebcamButton.onclick = e => {
        utils.clearBanner();
        if (setupWebcam(tmPose)) {
            secondaryCanvas.style.visibility = 'visible';
            playButton.classList.toggle('is-danger');
            playButton.classList.toggle('is-warning');
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
    playButton.classList.toggle('is-warning');
    playButton.classList.toggle('is-primary');
    window.requestAnimationFrame(loop);
}

export { init };