---
layout: null
---

document.addEventListener("DOMContentLoaded", function () {
  const mapEl = document.getElementById("history-country-map");
  if (!mapEl) return;

  const postsEl = document.getElementById("history-country-posts-data");
  let posts = [];
  try {
    posts = postsEl ? JSON.parse(postsEl.textContent) : [];
  } catch (e) {
    console.error("Failed to parse history-country-posts-data JSON:", e);
  }

  const valid = posts
    .filter(p => p && p.lat !== "" && p.lng !== "" && !isNaN(Number(p.lat)) && !isNaN(Number(p.lng)))
    .map(p => ({...p, lat: Number(p.lat), lng: Number(p.lng)}));

  const map = L.map("history-country-map", { worldCopyJump: true });

  // ✅ OSM 기본 타일
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const markers = [];
  const bounds = [];

  for (const p of valid) {
    const m = L.marker([p.lat, p.lng]).addTo(map);
    m.bindPopup(
      `<div class="history-popup">
        <b>${escapeHtml(p.city || "")}</b><br/>
        <a href="${p.url}">${escapeHtml(p.title)}</a>
      </div>`
    );
    m.on("click", () => {
      // marker click already opens popup; optional direct navigate:
      // window.location.href = p.url;
    });
    markers.push({ marker: m, url: p.url, title: p.title, city: p.city });
    bounds.push([p.lat, p.lng]);
  }

  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [18, 18] });
  } else {
    map.setView([20, 0], 2);
  }

  // ✅ 카드 hover → 해당 마커 popup 열기 (있으면)
  const cards = document.querySelectorAll(".history-card");
  cards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      const lat = Number(card.dataset.lat);
      const lng = Number(card.dataset.lng);
      const url = card.dataset.postUrl;

      if (isNaN(lat) || isNaN(lng)) return;

      const found = markers.find(x => x.url === url);
      if (!found) return;

      map.setView([lat, lng], Math.max(map.getZoom(), 6), { animate: true });
      found.marker.openPopup();
    });
  });

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});
