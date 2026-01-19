document.addEventListener("DOMContentLoaded", function () {
  const mapContainer = document.getElementById("history-world-map");
  if (!mapContainer) return;

  const geojsonUrl = mapContainer.dataset.geojsonUrl;
  const historyBase = mapContainer.dataset.historyBase || "/history/";
  const countriesCsv = mapContainer.dataset.countries || "";
  const countriesSet = new Set(
    countriesCsv
      .split(",")
      .map(s => s.trim().toLowerCase())
      .filter(Boolean)
  );

  const map = L.map("history-world-map", { worldCopyJump: true }).setView([20, 0], 2);

  // ✅ OSM 기본 타일 유지
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // 스타일 함수: 포스트 있는 나라만 강조
  function styleFn(feature) {
    const iso2 = (feature?.properties?.ISO_A2 || "").toLowerCase();
    const hasPost = countriesSet.has(iso2);

    return {
      color: hasPost ? "#2b6cff" : "#7b9acc",
      weight: hasPost ? 2 : 1,
      fillOpacity: hasPost ? 0.18 : 0.05
    };
  }

  fetch(geojsonUrl)
    .then(r => {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(data => {
      const layer = L.geoJSON(data, {
        style: styleFn,
        onEachFeature: (feature, lyr) => {
          const iso2 = (feature?.properties?.ISO_A2 || "").toLowerCase();
          const hasPost = countriesSet.has(iso2);

          // ✅ 영어 이름: NAME_EN 우선, 없으면 ADMIN fallback
          const nameEn =
            feature?.properties?.NAME_EN ||
            feature?.properties?.ADMIN ||
            iso2.toUpperCase();

          if (hasPost) {
            // hover 시 영어 이름 표시
            lyr.bindTooltip(nameEn, { sticky: true, direction: "top" });

            // 클릭 시 해당 국가 페이지로 이동
            lyr.on("click", () => {
              window.location.href = historyBase + iso2 + "/";
            });

            // ✅ 포스트 있는 나라 “핀” 자동 생성 (국가 폴리곤 중심)
            const center = lyr.getBounds().getCenter();
            L.circleMarker(center, {
              radius: 5,
              weight: 2,
              fillOpacity: 0.9
            })
              .addTo(map)
              .bindTooltip(nameEn, { permanent: false, sticky: true });
          }
        }
      }).addTo(map);

      // 보기 좋게 전체 bounds로 맞춤
      map.fitBounds(layer.getBounds(), { padding: [10, 10] });
    })
    .catch(err => {
      console.error("Failed to load world.geojson:", err);
      mapContainer.innerHTML =
        "<p style='color:#666;padding:1rem;'>Failed to load world map.</p>";
    });
});
