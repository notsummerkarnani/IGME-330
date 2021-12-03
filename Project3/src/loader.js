import * as main from "./main.js";
import { loadImages } from './utils.js';

import "https://cdn.jsdelivr.net/npm/@teachablemachine/pose@0.8.3/dist/teachablemachine-pose.min.js"

const imageSources = {
    cage1: './media/test.png',
};

// loadImages(imageSourcesObject,callback);
loadImages(imageSources, (imageData) => { main.init(tmPose, imageData) });