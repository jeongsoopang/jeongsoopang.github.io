---
title: "History"
permalink: /history/
layout: single
author_profile: true
custom_js:
  - /assets/js/history-world-map.js
header:
  overlay_image:
leaflet: true
---

Below is a clickable world map. Click a country to open my posts.

<div id="history-world-map"
     data-geojson-url="{{ '/assets/geo/world.geojson' | relative_url }}"
     data-history-base="{{ '/history/' | relative_url }}"
     style="height: 450px; border-radius: 12px; overflow: hidden;">
</div>


