document.addEventListener("DOMContentLoaded", function () {
  const mapEl = document.getElementById("history-country-map");
  if (!mapEl) return;

  // 카드에서 좌표 읽기
  const cards = Array.from(document.querySelectorAll(".history-card"));
  const points = cards
    .map((card) => {
      const lat = parseFloat(card.dataset.lat);
      const lng = parseFloat(card.dataset.lng);
      const city = (card.dataset.city || "").trim();
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      return { card, lat, lng, city };
    })
    .filter(Boolean);

  // 지도 생성 (덴마크 근처 기본 시야)
  const map = L.map("history-country-map", { worldCopyJump: true }).setView([56.1, 10.2], 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // 마커 생성
  const markers = new Map(); // card -> marker

  points.forEach((p) => {
    const marker = L.circleMarker([p.lat, p.lng], {
      radius: 7,
      weight: 2,
      fillOpacity: 0.9
    }).addTo(map);

    const label = p.city || "Visited";
    marker.bindTooltip(label, { sticky: true, direction: "top" });

    markers.set(p.card, marker);

    // 카드 hover -> 해당 핀 강조 & 이동
    p.card.addEventListener("mouseenter", () => {
      map.setView([p.lat, p.lng], Math.max(map.getZoom(), 9), { animate: true });
      marker.openTooltip();
    });

    p.card.addEventListener("mouseleave", () => {
      marker.closeTooltip();
    });
  });

  // 핀이 있으면 bounds에 맞춰 보기 좋게
  if (points.length > 0) {
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [20, 20] });
  }
});
