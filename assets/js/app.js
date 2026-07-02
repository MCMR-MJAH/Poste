document.addEventListener("DOMContentLoaded", () => {

    const distanceEl = document.getElementById("distance");
    const statusEl = document.getElementById("status");
    const startBtn = document.getElementById("startBtn");
    const endBtn = document.getElementById("endBtn");

    let isRunning = false;
    let startTime;

    initMap();

    startBtn.addEventListener("click", () => {
        if (isRunning) return;

        isRunning = true;
        startTime = Date.now();

        statusEl.textContent = "Tracking...";

        startTracking((data) => {
            distanceEl.textContent = data.distance.toFixed(2) + " m";
        });
    });

    endBtn.addEventListener("click", () => {
        if (!isRunning) return;

        isRunning = false;

        stopTracking((data) => {
            const duration = Math.floor((Date.now() - startTime) / 1000);

            statusEl.textContent = "Stopped";
            distanceEl.textContent = data.distance.toFixed(2) + " m";

            console.log("Final:", data.distance, "Duration:", duration);
        });
    });

});