import * as main from "./main.js";
import { loadImages } from './utils.js';

//import web components
import '../components/my-footer.js';
import '../components/my-nav.js';
import "https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.1/howler.min.js"


const imageSources = {
    ufo: './media/UFO.png',
};

const soundSources = {

}

// loadImages(imageSourcesObject,callback);
loadImages(imageSources, (imageData) => { main.init(tmPose, imageData) });