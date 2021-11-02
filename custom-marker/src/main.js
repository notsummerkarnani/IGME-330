function init() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3JrNzQ3MyIsImEiOiJja3VxOGV0M28wNXY0Mm5xOWwwOHoxYmd0In0.lZ9jdixba5-wAztZYahz1A';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-96, 37.8],
        zoom: 3
    });

    // code from the next step will go here!
    const geojson = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-77.032, 38.913]
            },
            properties: {
                title: 'Downtown Washington, D.C.',
                description: 'Washington, D.C.'
            }
        }, {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-122.414, 37.776]
            },
            properties: {
                title: 'Downtown San Francisco',
                description: 'San Francisco, California'
            }
        }, {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-77.612, 43.157]
            },
            properties: {
                title: 'Downtown Rochester',
                description: 'Rochester, New York'
            }
        }]
    };

    // add markers to map
    for (const {
            geometry,
            properties
        }
        of geojson.features) {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el).setLngLat(geometry.coordinates).setPopup(
            new mapboxgl.Popup({
                offset: 25
            }) // add popups
            .setHTML(`<h3>${properties.title}</h3><p>${properties.description}</p>`)
        ).addTo(map);
    }
}
export { init };