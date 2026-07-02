let watchId = null;

let tracking = false;
let path = [];

let totalDistance = 0;

function startTracking(onUpdate) {
    if (!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    tracking = true;
    path = [];
    totalDistance = 0;

    watchId = navigator.geolocation.watchPosition(
        (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            const point = { lat, lng };
            path.push(point);

            addRoutePoint(lat, lng);

            if (path.length === 1) {
                addStartMarker(lat, lng);
            } else {
                const prev = path[path.length - 2];
                totalDistance += getDistance(prev, point);
            }

            if (onUpdate) {
                onUpdate({
                    distance: totalDistance,
                    lat,
                    lng
                });
            }
        },
        (err) => {
            console.error(err);
            alert("GPS error: " + err.message);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
        }
    );
}

function stopTracking(onStop) {
    tracking = false;

    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }

    if (path.length > 0) {
        const last = path[path.length - 1];
        addEndMarker(last.lat, last.lng);

        if (onStop) {
            onStop({
                distance: totalDistance,
                end: last
            });
        }
    }
}

/* Haversine formula */
function getDistance(a, b) {
    const R = 6371e3;
    const φ1 = a.lat * Math.PI / 180;
    const φ2 = b.lat * Math.PI / 180;
    const Δφ = (b.lat - a.lat) * Math.PI / 180;
    const Δλ = (b.lng - a.lng) * Math.PI / 180;

    const x = Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
}