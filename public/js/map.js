mapboxgl.accessToken = mapToken;  // ← Is this here?

const map = new mapboxgl.Map({
    container: 'map',
    style: "mapbox://styles/mapbox/streets-v12",
    center: coordinates,  // ← Using coordinates variable
    zoom: 9
});



const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(coordinates)
    .addTo(map);