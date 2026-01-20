// assets/js/history-world-map.js
document.addEventListener("DOMContentLoaded", function () {
  const mapContainer = document.getElementById("history-world-map");
  if (!mapContainer) return;

  // Leaflet 로딩 실패 방지
  if (typeof L === "undefined") {
    mapContainer.innerHTML =
      "<p style='color:#666;padding:1rem;'>Leaflet failed to load.</p>";
    return;
  }

  // data attributes
  const geojsonUrl = mapContainer.dataset.geojsonUrl || "/assets/geo/world.geojson";
  const historyBase = mapContainer.dataset.historyBase || "/history/";

  // --- 핵심: UK(사이트 코드) <-> GB(ISO 코드) 매핑 ---
  // GeoJSON(ISO2) 기준으로 highlight/pin을 켜야 하므로 "uk" -> "gb" 로 normalize
  const normalizeToGeoIso2 = (code) => {
    const c = (code || "").toString().trim().toLowerCase();
    if (!c) return "";
    if (c === "uk") return "gb"; // GeoJSON ISO2는 GB
    return c;
  };

  // 클릭 이동은 사이트 permalink(너의 구조)로 가야 하므로 "gb" -> "uk"로 slug 변환
  const geoIso2ToPageSlug = (geoIso2) => {
    const c = (geoIso2 || "").toString().trim().toLowerCase();
    if (!c) return "";
    if (c === "gb") return "uk"; // 너의 페이지는 /history/uk/
    return c;
  };

  // data-countries="dk,uk,kr" 지원
  const countriesStr = (mapContainer.dataset.countries || "").trim();

  // (1) GeoJSON 매칭용 Set: dk, gb, ...
  const countriesGeoSet = new Set(
    countriesStr
      .split(",")
      .map((s) => normalizeToGeoIso2(s))
      .filter(Boolean)
  );

  // 지도 생성 (월드뷰)
  const map = L.map("history-world-map", { worldCopyJump: true }).setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // GeoJSON 로드
  fetch(geojsonUrl)
    .then((resp) => {
      if (!resp.ok) throw new Error(`Failed to load GeoJSON: ${resp.status} ${resp.statusText}`);
      return resp.json();
    })
    .then((geojson) => {
      // 스타일 함수: 포스트 있는 나라만 강조
      const styleFn = (feature) => {
        const iso2 = (
          feature?.properties?.ISO_A2 ||
          feature?.properties?.["ISO3166-1-Alpha-2"] ||
          ""
        )
          .toString()
          .toLowerCase();

        const hasPost = countriesGeoSet.has(iso2);

        return {
          weight: 1,
          opacity: 1,
          color: hasPost ? "#2b6cb0" : "#9aa5b1",
          fillOpacity: hasPost ? 0.25 : 0.05
        };
      };

      // 레이어 생성
      const layer = L.geoJSON(geojson, {
        style: styleFn,
        onEachFeature: (feature, lyr) => {
          const iso2 = (
            feature?.properties?.ISO_A2 ||
            feature?.properties?.["ISO3166-1-Alpha-2"] ||
            ""
          )
            .toString()
            .toLowerCase();

          const nameEn =
            feature?.properties?.NAME_EN ||
            feature?.properties?.ADMIN ||
            feature?.properties?.name ||
            iso2.toUpperCase();

          const hasPost = countriesGeoSet.has(iso2);
          if (!hasPost) return;

          // Hover tooltip
          lyr.bindTooltip(nameEn, { sticky: true });

          lyr.on("mouseover", function (e) {
            e.target.setStyle({ weight: 2, fillOpacity: 0.35 });
          });

          lyr.on("mouseout", function (e) {
            layer.resetStyle(e.target);
          });

          // Click -> 국가 페이지로 이동
          // (중요) GeoJSON ISO(GB) -> 사이트 slug(uk)로 변환
          lyr.on("click", function () {
            const slug = geoIso2ToPageSlug(iso2);
            const url = `${historyBase}${slug}/`;
            window.location.href = url;
          });

          // 핀(원형 마커): 해당 국가 bounds 중심
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
            // ignore bounds failure
          }
        }
      }).addTo(map);
    })
    .catch((err) => {
      console.error(err);
      mapContainer.innerHTML =
        "<p style='color:#666;padding:1rem;'>Failed to load world map data.</p>";
    });
});
