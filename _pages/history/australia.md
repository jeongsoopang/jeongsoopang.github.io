---
title: Australia 🇦🇺
permalink: /history/australia/
layout: single
classes: wide
author_profile: true
sidebar:
  nav: "history"
---

<div class="history-country-layout">

  <div class="history-country-left">
    <div class="card-grid">

      <!-- Canberra (대표 포스트로 바로 연결) -->
      <a class="card" href="/history/australia/canberra/2025-01-24/">
        <img src="/assets/images/history/australia/canberra/cover.jpg" alt="Canberra">
        <div class="card-content">
          <h3>Canberra</h3>
          <p>Koala, wallaby, calm capital</p>
        </div>
      </a>

      <!-- Merimbula -->
      <a class="card" href="/history/australia/merimbula/2025-01-xx/">
        <img src="/assets/images/history/australia/merimbula/cover.jpg" alt="Merimbula">
        <div class="card-content">
          <h3>Merimbula</h3>
          <p>Coastal air & quiet waves</p>
        </div>
      </a>

      <!-- Sydney -->
      <a class="card" href="/history/australia/sydney/2025-01-xx/">
        <img src="/assets/images/history/australia/sydney/cover.jpg" alt="Sydney">
        <div class="card-content">
          <h3>Sydney</h3>
          <p>Harbour, light, and big city rhythm</p>
        </div>
      </a>

    </div>
  </div>

  <div class="history-country-right">
    <div id="history-country-map"></div>
    <p style="color:#666; font-size: 0.9rem; margin-top: 0.5rem;">
      Pins are places I visited. Hover a card to focus the pin. Click a pin to open the post.
    </p>
  </div>

</div>

<script>
  window.HISTORY_POINTS = [
    {% for p in site.posts %}
      {% if p.country == "AU" %}
        {
          title: {{ p.title | jsonify }},
          url: {{ p.url | relative_url | jsonify }},
          city: {{ p.city | jsonify }},
          lat: {{ p.lat }},
          lng: {{ p.lng }}
        }{% unless forloop.last %},{% endunless %}
      {% endif %}
    {% endfor %}
  ];
</script>

<script src="{{ '/assets/js/history-country-map.js' | relative_url }}"></script>
