let map;
let routeLine;
let startMarker;
let endMarker;

function initMap() {
    map = L.map('map').setView([14.5995, 120.9842], 16); // default Manila

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    routeLine = L.polyline([], {
        color: 'blue',
        weight: 5
    }).addTo(map);
}

function addStartMarker(lat, lng) {
    if (startMarker) map.removeLayer(startMarker);

    startMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("START")
        .openPopup();
}

function addEndMarker(lat, lng) {
    if (endMarker) map.removeLayer(endMarker);

    endMarker = L.marker([lat, lng], { color: 'red' })
        .addTo(map)
        .bindPopup("END")
        .openPopup();
}

function addRoutePoint(lat, lng) {
    routeLine.addLatLng([lat, lng]);
}