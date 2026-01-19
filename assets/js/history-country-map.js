// assets/js/history-world-map.js
document.addEventListener("DOMContentLoaded", function () {
  const mapContainer = document.getElementById("history-world-map");
  if (!mapContainer) return;

  // Leaflet 로딩 체크
  if (typeof L === "undefined") {
    mapContainer.innerHTML =
      "<p style='color:#666;padding:1rem;'>Leaflet failed to load.</p>";
    return;
  }

  // data attributes
  const geojsonUrl =
    mapContainer.dataset.geojsonUrl || "/assets/geo/world.geojson";
  const historyBase = mapContainer.dataset.historyBase || "/history/";

  // posts에서 넘어온 국가코드 목록: "dk,kr,us" or "dk"
  const countriesStr = (mapContainer.dataset.countries || "").trim();

  const countriesSet = new Set(
    countriesStr
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );

  // 지도 생성
  const map = L.map("history-world-map", { worldCopyJump: true }).setView(
    [20, 0],
    2
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // 유틸: ISO2 읽기 (GeoJSON 종류가 바뀌어도 안 깨지게)
  function getIso2(feature) {
    const p = feature?.properties || {};
    const iso2 =
      p.ISO_A2 ||
      p["ISO3166-1-Alpha-2"] ||
      p.iso2 ||
      p.ISO2 ||
      "";

    return iso2.toString().trim().toLowerCase();
  }

  // 유틸: 표시할 나라 이름
  function getNameEn(feature, iso2) {
    const p = feature?.properties || {};
    return (
      p.NAME_EN ||
      p.ADMIN ||
      p.name ||
      p.NAME ||
      (iso2 ? iso2.toUpperCase() : "Unknown")
    );
  }

  // GeoJSON 로드
  fetch(geojsonUrl)
    .then((resp) => {
      if (!resp.ok) {
        throw new Error(
          `Failed to load GeoJSON: ${resp.status} ${resp.statusText}`
        );
      }
      return resp.json();
    })
    .then((geojson) => {
      const layer = L.geoJSON(geojson, {
        style: (feature) => {
          const iso2 = getIso2(feature);
          const hasPost = iso2 && countriesSet.has(iso2);

          return {
            weight: hasPost ? 1.5 : 1,
            opacity: 1,
            color: hasPost ? "#2b6cb0" : "#9aa5b1",
            fillOpacity: hasPost ? 0.25 : 0.06
          };
        },

        onEachFeature: (feature, lyr) => {
          const iso2 = getIso2(feature);
          const hasPost = iso2 && countriesSet.has(iso2);
          if (!hasPost) return;

          const nameEn = getNameEn(feature, iso2);

          // Hover tooltip
          lyr.bindTooltip(nameEn, { sticky: true });

          lyr.on("mouseover", (e) => {
            e.target.setStyle({ weight: 2.5, fillOpacity: 0.35 });
          });

          lyr.on("mouseout", (e) => {
            layer.resetStyle(e.target);
          });

          // Click -> /history/dk/
          lyr.on("click", () => {
            window.location.href = `${historyBase}${iso2}/`;
          });

          // 핀: 국가 bounds 중심
          try {
            const center = lyr.getBounds().getCenter();
            L.circleMarker(center, {
              radius: 6,
              weight: 2,
              fillOpacity: 0.9
            })
              .addTo(map)
              .bindTooltip(nameEn, { direction: "top", offset: [0, -6] });
          } catch (err) {
            // ignore
          }
        }
      }).addTo(map);

      // (선택) 포스트 있는 나라가 하나라도 있으면 대충 fitBounds
      // - 너무 큰 GeoJSON이면 전체 레이어 bounds가 세계 전체가 될 수 있어서,
      //   여기서는 굳이 안 당겨도 됨. 필요하면 켜자.
    })
    .catch((err) => {
      console.error(err);
      mapContainer.innerHTML =
        "<p style='color:#666;padding:1rem;'>Failed to load world map data.</p>";
    });
});
