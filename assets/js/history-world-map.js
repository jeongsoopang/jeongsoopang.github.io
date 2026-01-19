document.addEventListener("DOMContentLoaded", function () {
  const mapContainer = document.getElementById("history-world-map");
  if (!mapContainer) return;

  // HTML data-* 에서 URL 읽기 (Liquid는 HTML에서만 처리)
  const geojsonUrl = mapContainer.dataset.geojsonUrl;
  const historyBase = mapContainer.dataset.historyBase;

  if (!geojsonUrl) {
    console.error("Missing data-geojson-url on #history-world-map");
    mapContainer.innerHTML =
      "<p style='color:#666;padding:1rem;'>Missing geojson URL.</p>";
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
            const iso2 = feature.properties.ISO_A2;
            if (!iso2 || iso2 === "-99") return;

            // historyBase 예: "/history/"
            const base = historyBase || "/history/";
            window.location.href = base.replace(/\/?$/, "/") + iso2.toLowerCase() + "/";
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
