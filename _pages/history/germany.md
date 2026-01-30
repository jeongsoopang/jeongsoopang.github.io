---
title: Germany 🇩🇪
permalink: /history/germany/
layout: single
classes: wide
author_profile: true
sidebar:
  nav: "history"
---

<div class="history-country-layout">

  <div class="history-country-left">
    {% include history/post-cards-by-country.html country="DE" %}
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
    {% assign de_posts = site.posts | where: "country", "DE" %}
    {% for p in de_posts %}
      {
        title: {{ p.title | jsonify }},
        url: {{ p.url | relative_url | jsonify }},
        city: {{ p.city | jsonify }},
        lat: {{ p.lat }},
        lng: {{ p.lng }}
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ];
</script>

<script src="{{ '/assets/js/history-country-map.js' | relative_url }}"></script>
