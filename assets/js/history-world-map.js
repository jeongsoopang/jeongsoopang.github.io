(function () {
  // Leaflet이 아직 로드 안 된 경우 방어
  if (typeof L === "undefined") {
    console.error("Leaflet (L) is not loaded. Check footer/custom.html.");
    return;
  }

  // world map container
  var el = document.getElementById("history-world-map");
  if (!el) return;

  // 지도 생성
  var map = L.map("history-world-map", {
    scrollWheelZoom: false,
  }).setView([20, 0], 2);

  // 타일
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  // GeoJSON 경로
  var geoUrl = "{{ '/assets/geo/world.geojson' | relative_url }}";

  function countryStyle() {
    return {
      weight: 1,
      opacity: 1,
      fillOpacity: 0.15,
    };
  }

  function highlightStyle() {
    return {
      weight: 2,
      fillOpacity: 0.35,
    };
  }

  // 나라 클릭 시 이동 규칙:
  // geojson feature.properties.ISO_A2 또는 feature.id 등을 사용
  // 우리가 목표로 하는 URL: /history/<slug>/
  // (예: DK -> /history/denmark/)
  var countryToSlug = {
    DK: "denmark",
    KR: "korea",
    CN: "china",
    JP: "japan",
    US: "usa",
  };

  function getIsoA2(feature) {
    var p = feature.properties || {};
    return (
      p.ISO_A2 ||
      p.iso_a2 ||
      p["ISO3166-1-Alpha-2"] ||
      p.ISO2 ||
      null
    );
  }

  fetch(geoUrl)
    .then(function (r) {
      if (!r.ok) throw new Error("Failed to load geojson: " + r.status);
      return r.json();
    })
    .then(function (geo) {
      L.geoJSON(geo, {
        style: countryStyle,
        onEachFeature: function (feature, layer) {
          layer.on("mouseover", function () {
            layer.setStyle(highlightStyle());
          });
          layer.on("mouseout", function () {
            layer.setStyle(countryStyle());
          });

          layer.on("click", function () {
            var iso = getIsoA2(feature);
            if (!iso) return;

            var slug = countryToSlug[iso.toUpperCase()];
            if (!slug) {
              alert("No page yet for: " + iso + " (add mapping in history-world-map.js)");
              return;
            }

            var target = "{{ '/history/' | relative_url }}" + slug + "/";
            window.location.href = target;
          });
        },
      }).addTo(map);
    })
    .catch(function (err) {
      console.error(err);
      el.innerHTML =
        "<p>Failed to load world.geojson. Check console and path.</p>";
    });
})();
