/*
	The purpose of this file is to include all the drawing code in one file to clear up the main loop
*/

import * as utils from './utils.js';

let ctx, canvasWidth, canvasHeight, gradient;

const minPartConfidence = .5;

//Draws a circle at position (x,y) with radius and colour specified
const drawCircle = (x = 0, y = 0, rad, colour) => {
    ctx.save();
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function drawPose(pose) {
    //ctx.drawImage(webcam.canvas, 0, 0);
    // draw the keypoints and skeleton
    if (pose) {

        //Draw the torso of the player using 
        //pose[5].position, pose[6].position, pose[12].position, pose[11].position
        // left shoulder, right shoulder, right hip, left hip
        drawQuad(pose[5].position, pose[6].position, pose[12].position, pose[11].position, 'black');

        tmPose.drawKeypoints(pose, minPartConfidence, ctx, 5, 'black');
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
    ctx.globalAlpha = 0.2;
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

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // Draw Text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    fillText("Welcome to", canvasWidth / 2, canvasHeight / 2 - 110, "40pt 'Press Start 2P', cursive", "red");
    strokeText("Welcome to", canvasWidth / 2, canvasHeight / 2 - 110, "40pt 'Press Start 2P', cursive", "black", 2);
    fillText("Shadow Boxer", canvasWidth / 2, canvasHeight / 2 - 40, "74pt 'Press Start 2P', cursive", "red");
    strokeText("Shadow Boxer", canvasWidth / 2, canvasHeight / 2 - 40, "74pt 'Press Start 2P', cursive", "black", 2);
    fillText("Press 'Play' to start!", canvasWidth / 2, canvasHeight / 2 + 30, "40pt 'Press Start 2P', cursive", "red");
    strokeText("Press 'Play' to start!", canvasWidth / 2, canvasHeight / 2 + 30, "40pt 'Press Start 2P', cursive", "black", 2);
    fillText("Make sure your whole upper body is in frame", canvasWidth / 2, canvasHeight / 2 + 80, "25pt 'Press Start 2P', cursive", "red");
    strokeText("Make sure your whole upper body is in frame", canvasWidth / 2, canvasHeight / 2 + 80, "25pt 'Press Start 2P', cursive", "black", 2);
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
    fillText(`Score: ${score}`, 100, 20, "20pt courier", "black");
    fillText(`Health: ${health}`, canvasWidth - 110, 20, "20pt courier", "black");
}
export { setupCanvas, drawPose, reset, fillText, strokeText, drawHUD, drawCircle, drawQuad };