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

  // dk.md에서 window.HISTORY_POINTS로 주입됨
  const pointsRaw = Array.isArray(window.HISTORY_POINTS)
    ? window.HISTORY_POINTS
    : [];

  // 유효 좌표만
  const points = pointsRaw
    .map((p) => {
      const lat = Number(p.lat);
      const lng = Number(p.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      return {
        title: (p.title || "").toString(),
        city: (p.city || "").toString(),
        url: (p.url || "").toString(),
        lat,
        lng
      };
    })
    .filter(Boolean);

  // 지도 생성 (덴마크 중심)
  const map = L.map("history-country-map", { worldCopyJump: true }).setView(
    [56.2, 10.2],
    6
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // 카드들과 연결 (카드에 data-lat/data-lng/data-url 있어야 함)
  const cards = Array.from(document.querySelectorAll(".history-card"));

  // points를 빠르게 찾기 위한 key: `${lat},${lng}`
  const keyOf = (lat, lng) => `${lat.toFixed(6)},${lng.toFixed(6)}`;

  // marker 저장
  const markersByKey = new Map();

  // 마커 생성
  points.forEach((p) => {
    const marker = L.marker([p.lat, p.lng]).addTo(map);

    const label = p.city ? `${p.city}` : p.title || "Visited";
    marker.bindTooltip(label, { sticky: true, direction: "top" });

    marker.on("click", () => {
      if (p.url) window.location.href = p.url;
    });

    markersByKey.set(keyOf(p.lat, p.lng), marker);
  });

  // bounds 맞추기
  if (points.length > 0) {
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [20, 20] });
  }

  // 카드 hover -> 해당 마커로 이동 + tooltip
  cards.forEach((card) => {
    const lat = Number(card.dataset.lat);
    const lng = Number(card.dataset.lng);
    const url = (card.dataset.url || "").toString();

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const k = keyOf(lat, lng);
    const marker = markersByKey.get(k);
    if (!marker) return;

    card.addEventListener("mouseenter", () => {
      map.setView([lat, lng], Math.max(map.getZoom(), 9), { animate: true });
      marker.openTooltip();
    });

    card.addEventListener("mouseleave", () => {
      marker.closeTooltip();
    });

    // 카드 클릭도 포스트로 이동 (카드 자체가 a태그면 보통 필요없지만 안전)
    card.addEventListener("click", () => {
      if (url) window.location.href = url;
    });
  });
});
