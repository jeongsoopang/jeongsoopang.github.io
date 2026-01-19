---
title: History
permalink: /history/
layout: single
---

Below is a clickable world map. Click a country to open my posts.

<div
  id="history-world-map"
  style="width:100%;height:460px;border-radius:12px;overflow:hidden;"
  data-geojson-url="{{ '/assets/geo/world.geojson' | relative_url }}"
  data-history-base="{{ '/history/' | relative_url }}">
</div>

{%- assign history_posts = site.posts | where_exp: "p", "p.country" -%}
{%- capture history_posts_json -%}
[
{%- for p in history_posts -%}
  {
    "title": {{ p.title | jsonify }},
    "url": {{ p.url | relative_url | jsonify }},
    "country": {{ p.country | downcase | jsonify }},
    "city": {{ p.city | default: "" | jsonify }},
    "lat": {{ p.lat | default: "" | jsonify }},
    "lng": {{ p.lng | default: "" | jsonify }},
    "cover": {{ p.cover | default: "" | jsonify }},
    "excerpt": {{ p.excerpt | strip_html | truncate: 80 | jsonify }}
  }{%- unless forloop.last -%},{%- endunless -%}
{%- endfor -%}
]
{%- endcapture -%}

<script id="history-posts-data" type="application/json">
{{ history_posts_json | strip }}
</script>

<script src="{{ '/assets/js/history-world-map.js' | relative_url }}"></script>
