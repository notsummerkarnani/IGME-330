/*
	The purpose of this file is to include all the drawing code in one file to clear up the main loop
*/

import * as utils from './utils.js';

let ctx, canvasWidth, canvasHeight, gradient, healthGradient;

const minPartConfidence = .5;

const FACESTATE = Object.freeze({
    SMILE: 'SMILE',
    FROWN: 'FROWN',
    DEFAULT: 'DEFAULT'
})

//Draws a circle/arc at position (x,y) depending on angles with radius and colour specified
const drawCircle = (x = 0, y = 0, startAngle, endAngle, rad, colour = 'black') => {
    if (x <= 0 || y <= 0 || rad <= 0) return;
    ctx.save();
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y, rad, startAngle, endAngle, false);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

//draw the head of the player
//draw the eyes of the player
//draw mouth of the player (with a switch statement for mouth) 
function drawFace(head, eyes, face) {
    //Draw Player head
    drawCircle(head.x, head.y, 0, Math.PI * 2, head.radius, 'black');

    //Draw eyes
    drawCircle(eyes['left'].x, eyes['left'].y, 0, Math.PI * 2, eyes['left'].radius, 'white');
    drawCircle(eyes['left'].x, eyes['left'].y, 0, Math.PI * 2, eyes['left'].radius * .25, 'black');

    drawCircle(eyes['right'].x, eyes['right'].y, 0, Math.PI * 2, eyes['right'].radius, 'white');
    drawCircle(eyes['right'].x, eyes['right'].y, 0, Math.PI * 2, eyes['right'].radius * .25, 'black');

    switch (face) {
        case FACESTATE.SMILE:
            // ctx.save();
            // ctx.beginPath();
            // ctx.arc(head.x, head.y + head.radius * .25, head.radius * .5, 0, Math.PI, false);
            // ctx.closePath();
            // ctx.fill();
            // ctx.restore();
            drawCircle(head.x, head.y + head.radius * .25, 0, Math.PI, head.radius * .5, 'red');
            break;
        case FACESTATE.FROWN:
            // ctx.save();
            // ctx.beginPath();
            // ctx.arc(head.x, head.y + head.radius * .4, head.radius * .5, Math.PI, Math.PI * 2, false);
            // ctx.closePath();
            // ctx.fill();
            // ctx.restore();
            drawCircle(head.x, head.y + head.radius * .4, Math.PI, Math.PI * 2, head.radius * .5, 'red');
            break;
        case FACESTATE.DEFAULT:
            // ctx.save();
            // ctx.beginPath();
            // ctx.arc(head.x, head.y + head.radius * .25, head.radius * .25, 0, Math.PI * 2, false);
            // ctx.closePath();
            // ctx.fill();
            // ctx.restore();

            drawCircle(head.x, head.y + head.radius * .25, 0, Math.PI * 2, head.radius * .25, 'red');
            break;
    }

}


function drawPose(pose) {
    //ctx.drawImage(webcam.canvas, 0, 0);
    // draw the keypoints and skeleton
    if (pose) {

        //Draw the torso of the player using 
        //pose[5].position, pose[6].position, pose[12].position, pose[11].position
        // left shoulder, right shoulder, right hip, left hip
        drawQuad(pose[5].position, pose[6].position, pose[12].position, pose[11].position, 'black');

        //tmPose.drawKeypoints(pose, minPartConfidence, ctx, 5, 'white');
        tmPose.drawSkeleton(pose, minPartConfidence, ctx, 3, 'black');

        //draw wrist points
        tmPose.drawPoint(ctx, pose[9].position.y, pose[9].position.x, 12, 'red', 'black');
        tmPose.drawPoint(ctx, pose[10].position.y, pose[10].position.x, 12, 'red', 'black');
    }
}

//Draws a quad with 4 specified points and fills it
const drawQuad = (position0 = { x: 0, y: 0 }, position1 = { x: 0, y: 0 }, position2 = { x: 0, y: 0 }, position3 = { x: 0, y: 0 }, colour) => {
    ctx.save();
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(position0.x, position0.y);
    ctx.lineTo(position1.x, position1.y);
    ctx.lineTo(position2.x, position2.y);
    ctx.lineTo(position3.x, position3.y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

//draw text to the screen and fill it
const fillText = (string, x, y, css, colour) => {
    ctx.save();
    ctx.font = css;
    ctx.fillStyle = colour;
    ctx.fillText(string, x, y);
    ctx.restore();
}

function reset() {
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.fill();
    ctx.restore();
}

function setupCanvas(canvasElement) {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    // create a gradient that runs top to bottom
    gradient = utils.getLinearGradient(ctx, 0, 0, 0,
        canvasHeight, [{ percent: 0, color: "#C4FAF8" },
            { percent: .25, color: "#FBE4FF" },
            { percent: .5, color: "#FFFFD1" },
            { percent: .75, color: "#FFCBC1" },
            { percent: 1, color: "#FFA8A8" }
        ]);

    healthGradient = utils.getLinearGradient(ctx, canvasWidth - 110, 10, canvasWidth,
        10, [{ percent: 0, color: "red" },
            { percent: .5, color: "yellow" },
            { percent: 1, color: "green" }
        ]);

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // Draw Text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    fillText("Welcome to", canvasWidth / 2, canvasHeight / 2 - 110, "40pt Play, sans-serif", "red");
    strokeText("Welcome to", canvasWidth / 2, canvasHeight / 2 - 110, "40pt Play, sans-serif", "black", 2);
    fillText("Shadow Boxer", canvasWidth / 2, canvasHeight / 2 - 40, "74pt Play, sans-serif", "red");
    strokeText("Shadow Boxer", canvasWidth / 2, canvasHeight / 2 - 40, "74pt Play, sans-serif", "black", 2);
    fillText("Press 'Setup Webcam' to begin!", canvasWidth / 2, canvasHeight / 2 + 30, "40pt Play, sans-serif", "red");
    strokeText("Press 'Setup Webcam' to begin!", canvasWidth / 2, canvasHeight / 2 + 30, "40pt Play, sans-serif", "black", 2);
}

const strokeText = (string, x, y, css, colour, lineWidth) => {
    ctx.save();
    ctx.font = css;
    ctx.strokeStyle = colour;
    ctx.lineWidth = lineWidth;
    ctx.strokeText(string, x, y);
    ctx.restore();
}

const drawHUD = (score, health) => {
    fillText(`Score: ${score}`, 100, 22, "20pt Play, sans-serif", "black");

    //draw health bar
    //make sure it aligns with score
    ctx.save();
    ctx.strokeRect(canvasWidth - 110, 10, 100, 24);
    ctx.stroke();
    ctx.fillStyle = healthGradient;
    ctx.fillRect(canvasWidth - 110, 10, health, 24);
    ctx.fill();
    ctx.restore();

    fillText(`Health     ${health}`, canvasWidth - 120, 22, "20pt Play, sans-serif", "black");
}
export { FACESTATE, setupCanvas, drawPose, reset, fillText, strokeText, drawHUD, drawFace, drawCircle, drawQuad };