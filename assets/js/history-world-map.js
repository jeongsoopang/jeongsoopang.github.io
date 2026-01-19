(function () {
  const el = document.getElementById("history-world-map");
  if (!el) return;

  const geoUrl = el.dataset.geojsonUrl; // ✅ Liquid가 넣어준 정확한 URL
  if (!geoUrl) {
    el.innerHTML = "Missing data-geojson-url on map container.";
    return;
  }

  const map = L.map("history-world-map", { scrollWheelZoom: false }).setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 8,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  fetch(geoUrl, { cache: "no-store" })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status} for ${geoUrl}`);
      return r.json();
    })
    .then((geo) => {
      L.geoJSON(geo, {
        style: () => ({
          weight: 1,
          opacity: 0.6,
          fillOpacity: 0.08
        }),
        onEachFeature: (feature, layer) => {
          layer.on("click", () => {
            // TODO: 국가 클릭 -> 해당 국가 페이지로 이동 (다음 단계에서 연결)
            const name = feature.properties && (feature.properties.name || feature.properties.ADMIN);
            alert(`Clicked: ${name || "unknown"}`);
          });
        }
      }).addTo(map);
    })
    .catch((err) => {
      console.error(err);
      el.innerHTML = "Failed to load world.geojson. Check console and path.";
    });
})();
