import * as map from "./map.js";
import * as ajax from "./ajax.js";

let poi;

function loadPOI() {
    const url = `https://igm.rit.edu/~acjvks/courses/shared/330/maps/igm-points-of-interest.php`;

    function poiLoaded(jsonString) {
        poi = JSON.parse(jsonString);
        //console.log(poi);

        for (let p of poi) {
            map.addMarker(p.coordinates, p.title, "A POI !", "poi");
        }
    }

    ajax.dowloadFile(url, poiLoaded);
    console.log('run');
}

function init() {
    map.initMap();
    map.loadMarkers();
    map.addMarkersToMap();
    setupUI();
}

function setupUI() {
    // it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
    const lnglatRIT = [-77.67454147338866, 43.08484339838443];
    const lnglatIGM = [-77.67990589141846, 43.08447511795301];

    // RIT Zoom 15.5
    btn1.onclick = () => {
        map.setZoomLevel(15.5);
        map.setPitchAndBearing(0, 0);
        map.flyTo(lnglatRIT);
    }

    // RIT Isometric view 
    btn2.onclick = () => {
        map.setZoomLevel(15.5);
        map.setPitchAndBearing(45, 0);
        map.flyTo(lnglatRIT);
    }

    // World zoom 0
    btn3.onclick = () => {
        map.setZoomLevel();
        map.setPitchAndBearing(0, 0);
        map.flyTo();
    }

    // IGM zoom 18
    btn4.onclick = () => {
        map.setZoomLevel(18);
        map.setPitchAndBearing(0, 0);
        map.flyTo(lnglatIGM);
    }

    // load some marker data
    btn5.onclick = () => {
        if (!poi) {
            loadPOI();
        }
    }
}


export { init };