import Circle from "./circle.js";
import { drawHUD, FACESTATE } from "./canvas.js";
import * as utils from "./utils.js";
import "./sprite.js"

import Enemy from "./Enemy.js";
import Enemy2 from "./Enemy2.js";
import Enemy3 from "./Enemy3.js";
import Heart from "./heart.js";

const DIMENSIONS = { width: 100, height: 50 };

let round,
    enemySpeed,
    images,
    sounds,
    canvas,
    ctx,
    enemies,
    pickups,
    fps,
    frame,
    score,
    health,
    face,
    gradingMode;


const init = (imageData, soundData, canvasElement) => {
    round = 0;
    enemySpeed = 150;
    enemies = [];
    pickups = [];
    fps = 1 / 60; //not really fps but 1/fps
    score = 0;
    health = 100;
    frame = 0;
    gradingMode = false;

    images = imageData;
    sounds = soundData;
    canvas = canvasElement;
    ctx = canvas.getContext('2d');

    if (!sounds['music'].playing()) sounds['music'].play();
}

const loadLevel = () => {
    if (round < 10) round++;

    let baseEnemies, enemies2, enemies3;

    if (health < 30) {
        pickups = utils.createImageSprite(images.heart, Heart, 2, enemySpeed, DIMENSIONS.height, DIMENSIONS.height, {
            width: canvas.width,
            height: canvas.height
        });
    }

    baseEnemies = utils.createImageSprite(images.ufo, Enemy, round, enemySpeed, DIMENSIONS.width, DIMENSIONS.height, {
        width: canvas.width,
        height: canvas.height
    });

    if (round > 4) {
        enemies2 = utils.createImageSprite(images.ufo2, Enemy2, round - 4, enemySpeed, DIMENSIONS.width, DIMENSIONS.height, {
            width: canvas.width,
            height: canvas.height
        });

        if (round > 7)
            enemies3 = utils.createImageSprite(images.ufo3, Enemy3, round - 7, enemySpeed, DIMENSIONS.width, DIMENSIONS.height, {
                width: canvas.width,
                height: canvas.height
            });
    }

    enemies = baseEnemies.concat(enemies2).concat(enemies3);
    enemies = enemies.filter(enemy => enemy != undefined);
}

const update = (hitpoints) => {
    frame++;
    //loop through enemies
    for (let s of enemies) {
        if (!s.isDead) { // as long as enemy hasnt been hit
            //if enemy is onscreen
            if (s.offscreen) { //reflect enemy off walls
                if (s.x > 0 && s.x < canvas.width - s.width / 2) {
                    s.offscreen = false;
                }
            } else {
                if (s.x < 0 || s.x > canvas.width - s.width / 2) {
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
                        face = FACESTATE.SMILE;
                        //set enemy direction to reflect the punch
                        s.fwd.x = (hitpoints['wrist1'].x - hitpoints['elbow1'].x) / 10;
                        s.fwd.y = (hitpoints['wrist1'].y - hitpoints['elbow1'].y) / 10;
                    } else if (k == 'wrist2') { //check if its a wrist
                        sounds['punch'].play();
                        score++;
                        face = FACESTATE.SMILE;
                        //set enemy direction to reflect the punch
                        s.fwd.x = (hitpoints['wrist2'].x - hitpoints['elbow2'].x) / 10;
                        s.fwd.y = (hitpoints['wrist2'].y - hitpoints['elbow2'].y) / 10;
                    } else {
                        sounds['hit'].play();
                        if (!gradingMode) health -= 10;
                        face = FACESTATE.FROWN;
                        s.offscreen = true;
                    }
                }
            }
        } else { //check if enemy has left the screen and mark off
            if (s.x < 0 || s.x > canvas.width || s.y < 0 || s.y > canvas.height) {
                s.offscreen = true;
            }
        }
        s.move(fps, hitpoints['head']);
        // draw sprites
        s.draw(ctx);

    } // end for

    //remove enemies that have been hit and are off screen
    enemies = enemies.filter(s => !s.offscreen || !s.isDead);
    //create more enemies
    if (enemies.length == 0) loadLevel();


    for (let s of pickups) {
        if (!s.isDead) {
            //if enemy is onscreen
            if (s.offscreen) { //reflect enemy off walls
                if (s.x > 0 && s.x < canvas.width - s.width / 2) {
                    s.offscreen = false;
                }
            } else {
                if (s.x < 0 || s.x > canvas.width - s.width / 2) {
                    s.reflectX();
                }
            }

            let heartCircle = s.getCircle();

            if (heartCircle.intersects(hitpoints['wrist1']) || heartCircle.intersects(hitpoints['wrist2'])) {
                sounds['heal'].play();
                if (health < 100) health += 10;
                face = FACESTATE.SMILE;
                frame = 1;
                s.isDead = true;
                s.offscreen = true;
            }
        } else {
            if (s.x < 0 || s.x > canvas.width || s.y < 0 || s.y > canvas.height) {
                s.offscreen = true;
            }
        }
        s.move(fps);
        // draw sprites
        s.draw(ctx);
    }
    //every 30 frames, reset the face
    if (frame % 30 == 0) face = FACESTATE.DEFAULT;

    drawHUD(score, health);
}

const getHealth = () => {
    return health;
}

const getScore = () => {
    return score;
}

const reset = () => {
    init(images, sounds, canvas);
    loadLevel();
}

export { init, loadLevel, update, getHealth, getScore, reset, face }