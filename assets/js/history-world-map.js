document.addEventListener("DOMContentLoaded", function () {
  const mapContainer = document.getElementById("history-world-map");
  if (!mapContainer) return;

  // ✅ HTML에서 data-* 로 넘겨준 값 사용 (Liquid는 HTML에서만)
  const geojsonUrl = mapContainer.dataset.geojsonUrl;
  const historyBase = mapContainer.dataset.historyBase;

  if (!geojsonUrl || !historyBase) {
    console.error("Missing data-geojson-url or data-history-base on #history-world-map");
    mapContainer.innerHTML =
      "<p style='color:#666;padding:1rem;'>Map config missing.</p>";
    return;
  }

  const map = L.map("history-world-map", { worldCopyJump: true }).setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  fetch(geojsonUrl, { cache: "no-store" })
    .then((response) => {
      if (!response.ok) throw new Error("HTTP error " + response.status);
      return response.json();
    })
    .then((data) => {
      L.geoJSON(data, {
        style: {
          color: "#7b9acc",
          weight: 1,
          fillOpacity: 0.15
        },
        onEachFeature: function (feature, layer) {
          layer.on("click", function () {
            const iso2 = feature?.properties?.ISO_A2;
            if (!iso2 || iso2 === "-99") return;

            // ✅ historyBase가 "/history/" 같은 형태로 들어오므로 그냥 붙이면 됨
            window.location.href = historyBase + iso2.toLowerCase() + "/";
          });
        }
      }).addTo(map);
    })
    .catch((err) => {
      console.error("Failed to load world.geojson:", err);
      mapContainer.innerHTML =
        "<p style='color:#666;padding:1rem;'>Failed to load world map.</p>";
    });
});
