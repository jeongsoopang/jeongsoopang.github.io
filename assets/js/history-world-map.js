---
layout: null
---

document.addEventListener("DOMContentLoaded", function () {
  const mapContainer = document.getElementById("history-world-map");
  if (!mapContainer) return;

  // Read settings from HTML data-* attrs
  const geojsonUrl = mapContainer.dataset.geojsonUrl;
  const historyBase = mapContainer.dataset.historyBase; // like "/history/"

  // Read posts data injected by Liquid (JSON in the page)
  const postsEl = document.getElementById("history-posts-data");
  let posts = [];
  try {
    posts = postsEl ? JSON.parse(postsEl.textContent) : [];
  } catch (e) {
    console.error("Failed to parse #history-posts-data JSON:", e);
  }

  // countrySet: which ISO2 codes have posts (lowercase)
  const countrySet = new Set();
  const postsByCountry = new Map();
  for (const p of posts) {
    if (!p || !p.country) continue;
    const c = String(p.country).toLowerCase();
    countrySet.add(c);
    if (!postsByCountry.has(c)) postsByCountry.set(c, []);
    postsByCountry.get(c).push(p);
  }

  // Build Leaflet map
  const map = L.map("history-world-map", { worldCopyJump: true }).setView([20, 0], 2);

  // ✅ OSM 기본 타일 (원래 컬러 지도)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Utility: popup HTML for a country
  function buildPopupHtml(countryCode) {
    const items = postsByCountry.get(countryCode) || [];
    if (items.length === 0) return `<b>${countryCode.toUpperCase()}</b>`;
    const list = items
      .map((p) => `<li><a href="${p.url}">${escapeHtml(p.title)}</a></li>`)
      .join("");
    return `
      <div style="min-width:200px;">
        <div style="font-weight:700;margin-bottom:6px;">${countryCode.toUpperCase()}</div>
        <ul style="margin:0;padding-left:18px;">${list}</ul>
      </div>
    `;
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Fetch world geojson and render
  fetch(geojsonUrl)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${geojsonUrl}`);
      return res.json();
    })
    .then((data) => {
      let geoLayer = null;
      const markersLayer = L.layerGroup().addTo(map);

      geoLayer = L.geoJSON(data, {
        style: (feature) => {
          const iso2 = (feature?.properties?.["ISO3166-1-Alpha-2"] || "").toLowerCase();
          const hasPosts = countrySet.has(iso2);

          // ✅ 포스트 있는 나라만 강조
          if (hasPosts) {
            return {
              color: "#2f6fed",
              weight: 2,
              fillColor: "#2f6fed",
              fillOpacity: 0.18,
            };
          }
          return {
            color: "#9aa4b2",
            weight: 1,
            fillColor: "#000",
            fillOpacity: 0.02,
          };
        },

        onEachFeature: (feature, layer) => {
          const iso2 = (feature?.properties?.["ISO3166-1-Alpha-2"] || "").toLowerCase();
          const nameEn = feature?.properties?.name || iso2.toUpperCase();
          const hasPosts = countrySet.has(iso2);

          // ✅ “포스트 있는 나라만” 영어 이름 tooltip
          if (hasPosts) {
            layer.bindTooltip(nameEn, {
              sticky: true,
              direction: "center",
              className: "history-country-tooltip",
              opacity: 0.95,
            });
          }

          // hover highlight (only for post countries)
          layer.on("mouseover", () => {
            if (!hasPosts) return;
            layer.setStyle({ weight: 3, fillOpacity: 0.28 });
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              layer.bringToFront();
            }
          });
          layer.on("mouseout", () => {
            if (!hasPosts) return;
            layer.setStyle({ weight: 2, fillOpacity: 0.18 });
          });

          // ✅ 클릭: 포스트 있는 나라만 해당 국가 페이지로 이동
          layer.on("click", () => {
            if (!hasPosts) return;
            window.location.href = `${historyBase}${iso2}/`;
          });

          // ✅ 핀(마커)도 “포스트 있는 나라만” 찍기
          if (hasPosts) {
            const center = layer.getBounds().getCenter();
            const marker = L.circleMarker(center, {
              radius: 5,
              weight: 2,
              fillOpacity: 0.9,
            });
            marker.bindPopup(buildPopupHtml(iso2));
            marker.addTo(markersLayer);
          }
        },
      }).addTo(map);

      // Fit to world nicely
      // (optional) map.fitBounds(geoLayer.getBounds());
    })
    .catch((err) => {
      console.error("Failed to load world.geojson:", err);
      mapContainer.innerHTML =
        "<p style='color:#666;padding:1rem;'>Failed to load world map.</p>";
    });
});
