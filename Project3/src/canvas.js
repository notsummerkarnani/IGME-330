/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx, canvasWidth, canvasHeight, gradient;

function drawPose(pose) {
    //ctx.drawImage(webcam.canvas, 0, 0);
    // draw the keypoints and skeleton
    if (pose) {

        const minPartConfidence = .5;
        tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx, 5, 'black');
        tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx, 3, 'black');

        //draw wrist points
        tmPose.drawPoint(ctx, pose.keypoints[9].position.y, pose.keypoints[9].position.x, 12, 'red', 'black');
        tmPose.drawPoint(ctx, pose.keypoints[10].position.y, pose.keypoints[10].position.x, 12, 'red', 'black');

    }
}

const fillText = (ctx, string, x, y, css, colour) => {
    ctx.save();
    ctx.font = css;
    ctx.fillStyle = colour;
    ctx.fillText(string, x, y);
    ctx.restore();
}

function reset() {
    ctx.save();
    ctx.globalAlpha = 0.1;
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
    fillText(ctx, "Shadow Boxer", canvasWidth / 2, canvasHeight / 2 - 100, "74pt 'Press Start 2P', cursive", "red");
    strokeText(ctx, "Shadow Boxer", canvasWidth / 2, canvasHeight / 2 - 100, "74pt 'Press Start 2P', cursive", "black", 2);
    fillText(ctx, "Press 'Play' to start!", canvasWidth / 2, canvasHeight / 2 - 20, "40pt 'Press Start 2P', cursive", "red");
    strokeText(ctx, "Press 'Play' to start!", canvasWidth / 2, canvasHeight / 2 - 20, "40pt 'Press Start 2P', cursive", "black", 2);
    fillText(ctx, "Make sure your whole upper body is in frame", canvasWidth / 2, canvasHeight / 2 + 40, "25pt 'Press Start 2P', cursive", "red");
    strokeText(ctx, "Make sure your whole upper body is in frame", canvasWidth / 2, canvasHeight / 2 + 40, "25pt 'Press Start 2P', cursive", "black", 2);

}

const strokeText = (ctx, string, x, y, css, colour, lineWidth) => {
    ctx.save();
    ctx.font = css;
    ctx.strokeStyle = colour;
    ctx.lineWidth = lineWidth;
    ctx.strokeText(string, x, y);
    ctx.restore();
}

const drawHUD = (score, health) => {
    fillText(ctx, `Score: ${score}`, 100, 20, "20pt courier", "black");
    fillText(ctx, `Health: ${health}`, canvasWidth - 110, 20, "20pt courier", "black");
}
export { setupCanvas, drawPose, reset, fillText, strokeText, drawHUD };