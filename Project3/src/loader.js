import * as main from "./main.js";
import { loadMedia } from './utils.js';

//import web components
import '../components/my-footer.js';
import '../components/my-nav.js';
import "https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.1/howler.min.js"


const imageSources = {
    UFO: '../media/UFO.png',
    UFO2: '../media/UFO2.png'
};

const soundSources = {
    music: '../media/bckgr.wav',
    punch: '../media/punch.wav',
    hit: '../media/hit.mp3',
    heal: '../media/heal.flac'
};

loadMedia(imageSources, soundSources, () => {
    main.init(tmPose, imageSources, soundSources);
});