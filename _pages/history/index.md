---
title: History
permalink: /history/
layout: single
---

Below is a clickable world map. Countries with posts are highlighted.  
Hover to see the English country name, click to open posts.

{% assign countries = site.posts | map: "country" | compact | uniq | sort %}
<div
  id="history-world-map"
  style="width:100%;height:460px;border-radius:12px;overflow:hidden;"
  data-geojson-url="{{ '/assets/geo/world.geojson' | relative_url }}"
  data-history-base="{{ '/history/' | relative_url }}"
  data-countries="{% for c in countries %}{{ c | downcase }}{% unless forloop.last %},{% endunless %}{% endfor %}">
</div>

<script src="{{ '/assets/js/history-world-map.js' | relative_url }}"></script>
