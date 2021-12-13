import * as main from "./main.js";

//import web components
import '../components/my-footer.js';
import '../components/my-nav.js';
import '../components/my-banner.js';

import "https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.1/howler.min.js"


const sources = './data/sources.json';

const loadJsonFetch = (url, callback) => {
    let obj = {};

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            //else
            return response.text().then(text => { throw text; });
        })
        .then(json => {
            for (let k of Object.keys(json)) {
                obj[k] = {};
                for (let j of json[k]) {
                    let name = j.name;
                    obj[k][name] = j.src;
                }
            }
            callback(obj['images'], obj['sounds']);
        }).catch(error => {
            console.log(error);
            console.log("JSON is null!");
            return;
        });
}

const loadMedia = (imageSources, soundSources, callback) => {
    let numImages = Object.keys(imageSources).length;
    let numLoadedImages = 0;

    // load images
    console.log("... start loading images ...");
    for (let imageName in imageSources) {
        console.log("... trying to load '" + imageName + "'");
        let img = new Image();
        img.src = imageSources[imageName];
        imageSources[imageName] = img;
        img.onload = function() {
            console.log("SUCCESS: Image named '" + imageName + "' at " + this.src + " loaded!");
            ++numLoadedImages;
            if (numLoadedImages >= numImages) {
                console.log("... done loading images ...");
                callback(imageSources);
            }
        }
        img.onerror = function() {
            console.log("ERROR: image named '" + imageName + "' at " + this.src + " did not load!");
        }
    }

    // load sounds
    console.log("... start loading sounds ...");
    for (let soundName in soundSources) {
        console.log("... loading '" + soundName + "'");
        let sound = new Howl({ src: soundSources[soundName], autoplay: false });
        if (soundName == 'music') {
            sound._loop = true;
            sound._volume = 0.5;
        };
        soundSources[soundName] = sound;
    }
    console.log("... done loading sounds ...");
}

//only load up data if on app page
let page = window.location.pathname.split('/');
page = page[page.length - 1];

if (page == 'app.html')
    loadJsonFetch(sources, (images, sounds) => {
        loadMedia(images, sounds, () => {
            main.init(tmPose, images, sounds);
        })
    })