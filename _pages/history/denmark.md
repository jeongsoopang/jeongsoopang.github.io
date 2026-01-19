---
title: "Denmark 🇩🇰"
permalink: /history/denmark/
layout: single
classes: wide
author_profile: true
sidebar:
  nav: "history"
---

<div class="history-grid">
  <div class="history-posts">
    {% include history/country-cards.html country="Denmark" %}
  </div>

  <div class="history-map">
    <div id="country-map" style="height: 520px; border-radius: 12px; overflow: hidden;"></div>
  </div>
</div>

<script>
  window.HISTORY_COUNTRY = "Denmark";
</script>
<script src="{{ '/assets/js/history/country-map.js' | relative_url }}"></script>
