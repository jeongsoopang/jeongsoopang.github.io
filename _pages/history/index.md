---
title: History
permalink: /history/
layout: single
---

Below is a clickable world map. Countries with posts are highlighted.  
Hover to see the **English country name**. Click to open that country page.

<div
  id="history-world-map"
  style="width:100%;height:460px;border-radius:12px;overflow:hidden;"
  data-geojson-url="{{ '/assets/geo/world.geojson' | relative_url }}"
  data-history-base="{{ '/history/' | relative_url }}">
</div>

{%- assign history_posts = site.posts | where_exp: "p", "p.country" -%}
<script id="history-posts-data" type="application/json">
[
{%- for p in history_posts -%}
  {
    "country": "{{ p.country | downcase }}",
    "title": {{ p.title | jsonify }},
    "url": "{{ p.url | relative_url }}"
  }{%- unless forloop.last -%},{%- endunless -%}
{%- endfor -%}
]
</script>

<style>
/* tooltip label for countries that have posts */
.leaflet-tooltip.history-country-tooltip{
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 10px;
  padding: 4px 8px;
  font-size: 12px;
  color: #111;
  box-shadow: 0 2px 10px rgba(0,0,0,0.10);
}
</style>

<script src="{{ '/assets/js/history-world-map.js' | relative_url }}"></script>
