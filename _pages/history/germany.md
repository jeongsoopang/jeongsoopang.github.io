---
title: Germany 🇩🇪
permalink: /history/de/
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
    {% for p in site.posts %}
      {% if p.country == "DE" %}
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
