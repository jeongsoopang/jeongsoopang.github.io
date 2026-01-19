---
title: Denmark 🇩🇰
permalink: /history/dk/
layout: single
classes: wide
author_profile: true
sidebar:
  nav: "history"
---

<div class="history-country-layout">

  <div class="history-country-left">
    {% include history/post-cards-by-country.html country="DK" %}
  </div>

  <div class="history-country-right">
    <div id="history-country-map"></div>
    <p style="color:#666; font-size: 0.9rem; margin-top: 0.5rem;">
      Pins are places I visited. Hover a card to focus the pin. Click a pin to open the post.
    </p>
  </div>

</div>

<script>
  // DK 포스트에서 (title, url, city, lat, lng)만 뽑아서 JS로 넘김
  window.HISTORY_POINTS = [
    {% for p in site.posts %}
      {% assign c = p.country | default: "" | downcase %}
      {% if c == "dk" %}
        {
          title: {{ p.title | jsonify }},
          url: {{ p.url | relative_url | jsonify }},
          city: {{ p.city | default: "" | jsonify }},
          lat: {{ p.lat | default: "" | jsonify }},
          lng: {{ p.lng | default: "" | jsonify }}
        }{% unless forloop.last %},{% endunless %}
      {% endif %}
    {% endfor %}
  ];
</script>

<script src="{{ '/assets/js/history-country-map.js' | relative_url }}"></script>
