let map;
let userMarker;

let startMarker;
let line;

let tracking = false;
let path = [];

let startTime;
let timerInterval;

/* SMOOTHING VARIABLES */
let lastPoint = null;
let smoothMarker;

/* INIT MAP */
function initMap() {
  map = L.map("map");

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  navigator.geolocation.watchPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const point = L.latLng(lat, lng);

      /* 🔥 SMOOTH MOVEMENT (INTERPOLATION STYLE) */
      if (!smoothMarker) {
        smoothMarker = L.circleMarker(point, {
          radius: 10,
          color: "#0066ff",
          fillColor: "#0066ff",
          fillOpacity: 1
        }).addTo(map);

        map.setView(point, 19);
      } else {
        // smooth transition instead of instant jump
        smoothMove(point);
      }

      /* FOLLOW USER SMOOTHLY */
      map.panTo(point, {
        animate: true,
        duration: 0.5
      });

      /* TRACKING MODE */
      if (tracking) {
        path.push(point);

        if (!startMarker) {
          startMarker = L.marker(point)
            .addTo(map)
            .bindPopup("START");
        }

        if (line) map.removeLayer(line);

        line = L.polyline(path, {
          color: "blue",
          weight: 4,
          opacity: 0.8
        }).addTo(map);

        updateDistance();
      }
    },
    (err) => console.log(err),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    }
  );

  setTimeout(() => map.invalidateSize(), 300);
}

/* 🔥 SMOOTH INTERPOLATION */
function smoothMove(target) {
  if (!smoothMarker) return;

  const current = smoothMarker.getLatLng();

  const lat = lerp(current.lat, target.lat, 0.25);
  const lng = lerp(current.lng, target.lng, 0.25);

  const newPos = L.latLng(lat, lng);

  smoothMarker.setLatLng(newPos);
}

/* LINEAR INTERPOLATION */
function lerp(start, end, t) {
  return start + (end - start) * t;
}

/* START TRACKING */
function startTracking() {
  if (tracking) return;

  tracking = true;
  path = [];
  startTime = Date.now();

  timerInterval = setInterval(updateTimer, 1000);
}

/* STOP TRACKING */
function stopTracking() {
  tracking = false;
  clearInterval(timerInterval);
}

/* TIMER */
function updateTimer() {
  const diff = Date.now() - startTime;

  const sec = Math.floor(diff / 1000);
  const min = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");

  document.getElementById("duration").innerText = `${min}:${s}`;
}

/* DISTANCE (ROAD BASED) */
async function updateDistance() {
  if (path.length < 2) return;

  const coords = path.map(p => `${p.lng},${p.lat}`).join(";");

  const url = `https://router.project-osrm.org/route/v1/walking/${coords}?overview=false`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const meters = data.routes[0].distance;

    document.getElementById("distance").innerText =
      meters.toFixed(0) + " m";

  } catch (e) {
    console.log(e);
  }
}

/* UI */
function initUI() {
  document.getElementById("startBtn").addEventListener("click", startTracking);
  document.getElementById("endBtn").addEventListener("click", stopTracking);
}

/* INIT */
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  initUI();
});