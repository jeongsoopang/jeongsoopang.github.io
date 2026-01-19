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

  // data-countries="dk,kr,us" 혹은 "dk" 형태 지원
  const countriesStr = (mapContainer.dataset.countries || "").trim();
  const countriesSet = new Set(
    countriesStr
      .split(",")
      .map((s) => s.trim().toLowerCase())
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

        const hasPost = countriesSet.has(iso2);

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

          const hasPost = countriesSet.has(iso2);

          // 포스트 있는 나라만 hover/click 활성화
          if (!hasPost) return;

          // Hover tooltip
          lyr.bindTooltip(nameEn, { sticky: true });

          lyr.on("mouseover", function (e) {
            e.target.setStyle({ weight: 2, fillOpacity: 0.35 });
          });

          lyr.on("mouseout", function (e) {
            layer.resetStyle(e.target);
          });

          // Click -> 국가 페이지로 이동 (/history/dk/)
          lyr.on("click", function () {
            const url = `${historyBase}${iso2}/`;
            window.location.href = url;
          });

          // 핀(원형 마커) 찍기: 해당 국가의 bounds 중심
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
            // 일부 폴리곤에서 bounds 계산이 실패할 수 있으니 무시
          }
        }
      }).addTo(map);

      // 포스트가 있는 나라들 쪽으로 대략 fit (선택)
      // countriesSet이 비어있지 않으면, highlight된 나라들의 bounds를 추정해서 fit하고 싶지만
      // GeoJSON이 크고 필터링이 복잡해질 수 있으니 기본 월드뷰 유지.
      // 필요하면 여기에서 fitBounds 로직 추가 가능.
    })
    .catch((err) => {
      console.error(err);
      mapContainer.innerHTML =
        "<p style='color:#666;padding:1rem;'>Failed to load world map data.</p>";
    });
});
