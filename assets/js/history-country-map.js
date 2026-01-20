// assets/js/history-country-map.js
document.addEventListener("DOMContentLoaded", function () {
  const mapEl = document.getElementById("history-country-map");
  if (!mapEl) return;

  // Leaflet 로딩 체크
  if (typeof L === "undefined") {
    mapEl.innerHTML =
      "<p style='color:#666;padding:1rem;'>Leaflet failed to load.</p>";
    return;
  }

  // 카드에서 좌표 읽기 (우선순위 1)
  const cards = Array.from(document.querySelectorAll(".history-card"));
  const pointsFromCards = cards
    .map((card) => {
      const lat = parseFloat(card.dataset.lat);
      const lng = parseFloat(card.dataset.lng);
      const city = (card.dataset.city || "").trim();
      const url = (card.dataset.url || card.getAttribute("href") || "").trim();
      const title = (card.querySelector(".history-card__title")?.textContent || "").trim();

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      return { card, lat, lng, city, url, title };
    })
    .filter(Boolean);

  // window.HISTORY_POINTS 사용 (우선순위 2, 카드에 좌표가 없을 때)
  const pointsFromWindow =
    Array.isArray(window.HISTORY_POINTS)
      ? window.HISTORY_POINTS
          .map((p) => {
            const lat = parseFloat(p.lat);
            const lng = parseFloat(p.lng);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
            return {
              card: null,
              lat,
              lng,
              city: (p.city || "").trim(),
              url: (p.url || "").trim(),
              title: (p.title || "").trim()
            };
          })
          .filter(Boolean)
      : [];

  const points = pointsFromCards.length > 0 ? pointsFromCards : pointsFromWindow;

  // 지도 생성 (기본: 덴마크 근처)
  const map = L.map("history-country-map", { worldCopyJump: true }).setView([56.1, 10.2], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // 마커 생성
  const markers = []; // { marker, point }
  points.forEach((p) => {
    const label = p.city || p.title || "Visited";

    const marker = L.circleMarker([p.lat, p.lng], {
      radius: 7,
      weight: 2,
      fillOpacity: 0.9
    }).addTo(map);

    marker.bindTooltip(label, { sticky: true, direction: "top" });

    // 핀 클릭 -> 포스트로 이동
    if (p.url) {
      marker.on("click", () => {
        window.location.href = p.url;
      });
    }

    markers.push({ marker, point: p });

    // 카드 hover -> 핀 강조 & 이동 (카드가 있는 경우)
    if (p.card) {
      p.card.addEventListener("mouseenter", () => {
        map.setView([p.lat, p.lng], Math.max(map.getZoom(), 9), { animate: true });
        marker.openTooltip();
      });

      p.card.addEventListener("mouseleave", () => {
        marker.closeTooltip();
      });
    }
  });

  // 핀이 있으면 bounds에 맞춰서 보기 좋게
  if (points.length > 0) {
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [20, 20] });
  }
});
